import { constants as fsConstants } from 'node:fs';
import { access, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import sharp from 'sharp';

const DEFAULT_INPUT = 'public/assets/images';
const DEFAULT_OUTPUT = 'optimized/assets/images';
const DEFAULT_REPORT_DIR = 'optimized';
const DEFAULT_MAX_WIDTH = 1280;
const DEFAULT_MAX_HEIGHT = 1280;
const DEFAULT_QUALITY = 68;
const DEFAULT_EFFORT = 6;
const DEFAULT_CONCURRENCY = 4;
const SUPPORTED_EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg', '.jfif']);

function printHelp() {
  console.log(`Usage:
  node scripts/compress-images.mjs [options]

Options:
  --input <path>         Source folder or file. Default: ${DEFAULT_INPUT}
  --output <path>        Output folder. Default: ${DEFAULT_OUTPUT}
  --report-dir <path>    Report folder. Default: ${DEFAULT_REPORT_DIR}
  --max-width <number>   Maximum output width. Default: ${DEFAULT_MAX_WIDTH}
  --max-height <number>  Maximum output height. Default: ${DEFAULT_MAX_HEIGHT}
  --quality <0-100>      WebP quality. Default: ${DEFAULT_QUALITY}
  --effort <0-6>         WebP effort. Default: ${DEFAULT_EFFORT}
  --concurrency <number> Parallel files to process. Default: ${DEFAULT_CONCURRENCY}
  --dry-run              Do not write images or reports.
  --help, -h             Show this help.

Examples:
  npm run images:compress
  npm run images:compress:strong
  node scripts/compress-images.mjs --input public/assets/images/body --output optimized/body-test
`);
}

function parseNumberFlag(name, value, { min, max }) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be a number between ${min} and ${max}.`);
  }
  return parsed;
}

function parseArgs(argv) {
  const options = {
    input: DEFAULT_INPUT,
    output: DEFAULT_OUTPUT,
    reportDir: DEFAULT_REPORT_DIR,
    maxWidth: DEFAULT_MAX_WIDTH,
    maxHeight: DEFAULT_MAX_HEIGHT,
    quality: DEFAULT_QUALITY,
    effort: DEFAULT_EFFORT,
    concurrency: DEFAULT_CONCURRENCY,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      throw new Error(`${arg} requires a value.`);
    }

    if (arg === '--input') {
      options.input = next;
    } else if (arg === '--output') {
      options.output = next;
    } else if (arg === '--report-dir') {
      options.reportDir = next;
    } else if (arg === '--max-width') {
      options.maxWidth = parseNumberFlag(arg, next, { min: 1, max: 10000 });
    } else if (arg === '--max-height') {
      options.maxHeight = parseNumberFlag(arg, next, { min: 1, max: 10000 });
    } else if (arg === '--quality') {
      options.quality = parseNumberFlag(arg, next, { min: 0, max: 100 });
    } else if (arg === '--effort') {
      options.effort = parseNumberFlag(arg, next, { min: 0, max: 6 });
    } else if (arg === '--concurrency') {
      options.concurrency = parseNumberFlag(arg, next, { min: 1, max: 32 });
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }

    i += 1;
  }

  return options;
}

async function pathExists(path) {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function collectImageFiles(inputPath) {
  const resolved = resolve(inputPath);
  if (!(await pathExists(resolved))) {
    throw new Error(`Input path not found: ${inputPath}`);
  }

  const info = await stat(resolved);
  if (info.isFile()) {
    return SUPPORTED_EXTENSIONS.has(extname(resolved).toLowerCase()) ? [resolved] : [];
  }

  const files = [];
  const entries = await readdir(resolved, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(resolved, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectImageFiles(entryPath));
      continue;
    }

    if (entry.isFile() && SUPPORTED_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files;
}

function getOutputPath(inputFile, inputRoot, outputRoot) {
  const relativePath = relative(inputRoot, inputFile);
  const parsedExt = extname(relativePath);
  const withoutExt = relativePath.slice(0, -parsedExt.length);
  return join(outputRoot, `${withoutExt}.webp`);
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function getSavingsPercent(inputBytes, outputBytes) {
  if (!inputBytes || !Number.isFinite(outputBytes)) return 0;
  return ((inputBytes - outputBytes) / inputBytes) * 100;
}

async function processImage(inputFile, options, inputRoot, outputRoot) {
  const original = await stat(inputFile);
  const outputPath = getOutputPath(inputFile, inputRoot, outputRoot);
  const baseResult = {
    source: relative(process.cwd(), inputFile).replaceAll('\\', '/'),
    output: relative(process.cwd(), outputPath).replaceAll('\\', '/'),
    originalBytes: original.size,
    outputBytes: null,
    savingsPercent: null,
    status: 'pending',
    reason: null,
  };

  if (options.dryRun) {
    return {
      ...baseResult,
      status: 'dry_run',
      reason: 'not_written',
    };
  }

  try {
    const pipeline = sharp(inputFile, { animated: false })
      .rotate()
      .resize({
        width: options.maxWidth,
        height: options.maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: options.quality,
        effort: options.effort,
      });

    const outputBuffer = await pipeline.toBuffer();
    const outputBytes = outputBuffer.byteLength;
    const savingsPercent = getSavingsPercent(original.size, outputBytes);

    if (outputBytes >= original.size) {
      return {
        ...baseResult,
        outputBytes,
        savingsPercent,
        status: 'skipped_larger',
        reason: 'compressed result is not smaller than source',
      };
    }

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, outputBuffer);

    return {
      ...baseResult,
      outputBytes,
      savingsPercent,
      status: 'written',
      reason: null,
    };
  } catch (error) {
    return {
      ...baseResult,
      status: 'failed',
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker())
  );

  return results;
}

function createSummary(results) {
  const written = results.filter(result => result.status === 'written');
  const originalBytes = results.reduce((sum, result) => sum + result.originalBytes, 0);
  const outputBytes = written.reduce((sum, result) => sum + (result.outputBytes || 0), 0);

  return {
    totalFiles: results.length,
    writtenFiles: written.length,
    skippedLargerFiles: results.filter(result => result.status === 'skipped_larger').length,
    failedFiles: results.filter(result => result.status === 'failed').length,
    dryRunFiles: results.filter(result => result.status === 'dry_run').length,
    originalBytes,
    outputBytes,
    savingsBytes: originalBytes - outputBytes,
    savingsPercent: getSavingsPercent(originalBytes, outputBytes),
  };
}

function createMarkdownReport(options, summary, results) {
  const lines = [
    '# Image Compression Report',
    '',
    `- Mode: ${options.dryRun ? 'dry-run' : 'write'}`,
    `- Input: ${options.input}`,
    `- Output: ${options.output}`,
    `- Max size: ${options.maxWidth}x${options.maxHeight}`,
    `- Quality: ${options.quality}`,
    `- Effort: ${options.effort}`,
    `- Concurrency: ${options.concurrency}`,
    '',
    '## Summary',
    '',
    `- Total files: ${summary.totalFiles}`,
    `- Written: ${summary.writtenFiles}`,
    `- Skipped larger: ${summary.skippedLargerFiles}`,
    `- Failed: ${summary.failedFiles}`,
    `- Original total: ${formatBytes(summary.originalBytes)}`,
    `- Written output total: ${formatBytes(summary.outputBytes)}`,
    `- Estimated savings: ${formatBytes(summary.savingsBytes)} (${summary.savingsPercent.toFixed(2)}%)`,
    '',
    '## Files',
    '',
    '| Status | Source | Original | Output | Savings | Reason |',
    '| --- | --- | ---: | ---: | ---: | --- |',
  ];

  for (const result of results) {
    lines.push([
      result.status,
      result.source,
      formatBytes(result.originalBytes),
      result.outputBytes === null ? '-' : formatBytes(result.outputBytes),
      result.savingsPercent === null ? '-' : `${result.savingsPercent.toFixed(2)}%`,
      result.reason || '',
    ].join(' | ').replace(/^/, '| ').replace(/$/, ' |'));
  }

  lines.push('');
  return lines.join('\n');
}

async function writeReports(options, summary, results) {
  if (options.dryRun) return;

  const reportDir = resolve(options.reportDir);
  await mkdir(reportDir, { recursive: true });

  const report = {
    generatedAt: new Date().toISOString(),
    options,
    summary,
    files: results,
  };

  await writeFile(join(reportDir, 'compression-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(join(reportDir, 'compression-report.md'), createMarkdownReport(options, summary, results), 'utf8');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  sharp.concurrency(options.concurrency);

  const inputRoot = resolve(options.input);
  const outputRoot = resolve(options.output);
  const files = await collectImageFiles(inputRoot);

  if (files.length === 0) {
    console.log('No supported images found.');
    return;
  }

  console.log(`${options.dryRun ? 'Dry run' : 'Compressing'} ${files.length} image(s)`);
  console.log(`Input: ${options.input}`);
  console.log(`Output: ${options.output}`);
  console.log(`Profile: ${options.maxWidth}x${options.maxHeight}, quality ${options.quality}, effort ${options.effort}`);

  const results = await runWithConcurrency(files, options.concurrency, async (file, index) => {
    const result = await processImage(file, options, inputRoot, outputRoot);
    const outputInfo = result.outputBytes === null ? '' : ` -> ${formatBytes(result.outputBytes)}`;
    console.log(`[${index + 1}/${files.length}] ${result.status}: ${result.source} (${formatBytes(result.originalBytes)}${outputInfo})`);
    return result;
  });

  const summary = createSummary(results);
  await writeReports(options, summary, results);

  console.log('');
  console.log(`Total files: ${summary.totalFiles}`);
  console.log(`Written: ${summary.writtenFiles}`);
  console.log(`Skipped larger: ${summary.skippedLargerFiles}`);
  console.log(`Failed: ${summary.failedFiles}`);
  console.log(`Original total: ${formatBytes(summary.originalBytes)}`);

  if (options.dryRun) {
    console.log('Dry run only: no images or reports were written.');
  } else {
    console.log(`Output total: ${formatBytes(summary.outputBytes)}`);
    console.log(`Estimated savings: ${formatBytes(summary.savingsBytes)} (${summary.savingsPercent.toFixed(2)}%)`);
    console.log(`Reports: ${join(options.reportDir, 'compression-report.json')} and ${join(options.reportDir, 'compression-report.md')}`);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
