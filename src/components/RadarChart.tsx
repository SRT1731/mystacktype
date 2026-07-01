import { DIMENSION_LABELS, type DimensionVector } from '../config/quiz';

interface RadarChartProps {
  dimensions: DimensionVector;
  size?: number;
  className?: string;
  showLabels?: boolean;
}

const AXES: Array<{ key: keyof DimensionVector; label: string }> = [
  { key: 'lossSpeed', label: DIMENSION_LABELS.lossSpeed },
  { key: 'protein', label: DIMENSION_LABELS.protein },
  { key: 'strengthTraining', label: DIMENSION_LABELS.strengthTraining },
  { key: 'intakeCapacity', label: DIMENSION_LABELS.intakeCapacity },
  { key: 'recovery', label: DIMENSION_LABELS.recovery },
  { key: 'maintenanceReadiness', label: DIMENSION_LABELS.maintenanceReadiness },
];

export function RadarChart({
  dimensions,
  size = 260,
  className,
  showLabels = true,
}: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.34;
  const labelRadius = size * 0.44;
  const rings = [0.25, 0.5, 0.75, 1];
  const polygon = pointsForValues(dimensions, center, radius)
    .map(([x, y]) => `${x},${y}`)
    .join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="GLP-1 muscle loss risk radar chart"
    >
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={pointsForRing(center, radius * ring)
            .map(([x, y]) => `${x},${y}`)
            .join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
        />
      ))}

      {AXES.map((axis, index) => {
        const [x, y] = pointForAxis(index, center, radius);
        const [labelX, labelY] = pointForAxis(index, center, labelRadius);
        return (
          <g key={axis.key}>
            <line
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
            />
            {showLabels ? (
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.72)"
                fontSize={size * 0.04}
                fontFamily="Inter, ui-sans-serif, system-ui"
              >
                {axis.label}
              </text>
            ) : null}
          </g>
        );
      })}

      <polygon
        points={polygon}
        fill="rgba(144,255,190,0.28)"
        stroke="rgba(144,255,190,0.92)"
        strokeWidth="2"
      />
    </svg>
  );
}

function pointsForValues(
  dimensions: DimensionVector,
  center: number,
  radius: number
): Array<[number, number]> {
  return AXES.map((axis, index) =>
    pointForAxis(index, center, radius * dimensions[axis.key])
  );
}

function pointsForRing(center: number, radius: number): Array<[number, number]> {
  return AXES.map((_, index) => pointForAxis(index, center, radius));
}

function pointForAxis(index: number, center: number, radius: number): [number, number] {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / AXES.length;
  return [
    round(center + Math.cos(angle) * radius),
    round(center + Math.sin(angle) * radius),
  ];
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
