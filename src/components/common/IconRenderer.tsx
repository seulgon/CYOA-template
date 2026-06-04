import React from 'react';
import {
    Activity,
    Brain,
    Briefcase,
    Church,
    Circle,
    Coins,
    Compass,
    Dna,
    Fingerprint,
    Flame,
    FlaskConical,
    Globe,
    Heart,
    MapPin,
    Package,
    ScrollText,
    Shield,
    Sparkles,
    Sword,
    Swords,
    Tag,
    User,
    Wrench,
    type LucideIcon,
} from 'lucide-react';

interface IconRendererProps {
    name?: string;
    size?: number;
    color?: string;
    style?: React.CSSProperties;
    className?: string;
}

const iconMap: Record<string, LucideIcon> = {
    Activity,
    Brain,
    Briefcase,
    Church,
    Circle,
    Coins,
    Compass,
    Dna,
    Fingerprint,
    Flame,
    FlaskConical,
    Globe,
    Heart,
    MapPin,
    Package,
    ScrollText,
    Shield,
    Sparkles,
    Sword,
    Swords,
    Tag,
    User,
    Wrench,
};

/**
 * Unified Icon Renderer
 *
 * Resolves icon names from lucide-react:
 *   - "Sword" -> lucide-react
 */
const IconRenderer: React.FC<IconRendererProps> = ({ name, size = 16, color, style, className }) => {
    if (!name) return null;

    const IconComponent = iconMap[name];

    if (!IconComponent) return null;

    return <IconComponent size={size} color={color} style={style} className={className} />;
};

export default IconRenderer;
