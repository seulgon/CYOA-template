import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

function printHelp() {
    console.log(`Usage:
  node scripts/convert-png-to-webp.mjs <input...> [--rewrite <file...>] [--quality <0-100>] [--recursive]

Examples:
  node scripts/convert-png-to-webp.mjs public/assets/images/alignments
  node scripts/convert-png-to-webp.mjs public/assets/images/alignments --rewrite src/data/cyoa/alignments.ts
`);
}

function parseArgs(argv) {
    const inputs = [];
    const rewrites = [];
    let quality = 85;
    let recursive = false;

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];

        if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        }

        if (arg === '--rewrite') {
            i += 1;
            while (i < argv.length && !argv[i].startsWith('--')) {
                rewrites.push(argv[i]);
                i += 1;
            }
            i -= 1;
            continue;
        }

        if (arg === '--quality') {
            const value = Number(argv[i + 1]);
            if (!Number.isFinite(value) || value < 0 || value > 100) {
                throw new Error('--quality must be a number between 0 and 100.');
            }
            quality = value;
            i += 1;
            continue;
        }

        if (arg === '--recursive') {
            recursive = true;
            continue;
        }

        inputs.push(arg);
    }

    if (inputs.length === 0) {
        throw new Error('At least one input path is required.');
    }

    return { inputs, rewrites, quality, recursive };
}

function commandExists(command, args = ['-version']) {
    const result = spawnSync(command, args, { stdio: 'ignore', shell: false });
    return result.status === 0;
}

function pickConverter() {
    if (commandExists('cwebp', ['-version'])) {
        return {
            name: 'cwebp',
            convert(inputPath, outputPath, quality) {
                return spawnSync('cwebp', ['-quiet', '-q', String(quality), inputPath, '-o', outputPath], {
                    stdio: 'inherit',
                    shell: false,
                });
            },
        };
    }

    if (commandExists('magick', ['-version'])) {
        return {
            name: 'magick',
            convert(inputPath, outputPath, quality) {
                return spawnSync('magick', [inputPath, '-quality', String(quality), outputPath], {
                    stdio: 'inherit',
                    shell: false,
                });
            },
        };
    }

    if (commandExists('ffmpeg', ['-version'])) {
        return {
            name: 'ffmpeg',
            convert(inputPath, outputPath, quality) {
                return spawnSync('ffmpeg', ['-y', '-i', inputPath, '-quality', String(quality), outputPath], {
                    stdio: 'inherit',
                    shell: false,
                });
            },
        };
    }

    throw new Error('No supported converter found. Install cwebp, ImageMagick (magick), or ffmpeg.');
}

function collectPngFiles(inputPath, recursive) {
    const resolved = resolve(inputPath);
    if (!existsSync(resolved)) {
        throw new Error(`Input path not found: ${inputPath}`);
    }

    const info = statSync(resolved);
    if (info.isFile()) {
        return extname(resolved).toLowerCase() === '.png' ? [resolved] : [];
    }

    const results = [];
    for (const entry of readdirSync(resolved, { withFileTypes: true })) {
        const entryPath = join(resolved, entry.name);
        if (entry.isDirectory()) {
            if (recursive) {
                results.push(...collectPngFiles(entryPath, true));
            }
            continue;
        }

        if (extname(entry.name).toLowerCase() === '.png') {
            results.push(entryPath);
        }
    }
    return results;
}

function rewriteReferences(files) {
    for (const rewriteFile of files) {
        const resolved = resolve(rewriteFile);
        if (!existsSync(resolved)) {
            throw new Error(`Rewrite target not found: ${rewriteFile}`);
        }

        const source = readFileSync(resolved, 'utf8');
        const updated = source.replace(/\.png(["'])/g, '.webp$1');

        if (updated !== source) {
            writeFileSync(resolved, updated, 'utf8');
            console.log(`Rewrote references in ${rewriteFile}`);
        } else {
            console.log(`No .png references found in ${rewriteFile}`);
        }
    }
}

function main() {
    const { inputs, rewrites, quality, recursive } = parseArgs(process.argv.slice(2));
    const converter = pickConverter();
    const pngFiles = [...new Set(inputs.flatMap((inputPath) => collectPngFiles(inputPath, recursive)))];

    if (pngFiles.length === 0) {
        console.log('No PNG files found.');
        return;
    }

    console.log(`Using converter: ${converter.name}`);

    for (const pngFile of pngFiles) {
        const outputPath = join(dirname(pngFile), `${basename(pngFile, '.png')}.webp`);
        mkdirSync(dirname(outputPath), { recursive: true });
        console.log(`Converting ${pngFile} -> ${outputPath}`);
        const result = converter.convert(pngFile, outputPath, quality);
        if (result.status !== 0) {
            throw new Error(`Conversion failed for ${pngFile}`);
        }
    }

    if (rewrites.length > 0) {
        rewriteReferences(rewrites);
    }
}

try {
    main();
} catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
}
