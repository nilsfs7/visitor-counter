'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

interface IChartArea {
  data: { date: string; l1: number; l2?: number; l3?: number; l4?: number; l5?: number }[];
  labels: string[];
  colors?: string[];
  title: string;
  description?: string;
  tickLine?: boolean;
  className?: string;
}

export function ChartArea({ data, labels, colors = [], title, description, tickLine = true, className }: IChartArea) {
  const chartConfig = {
    l1: {
      label: labels[0],
      color: colors[0] ? `var(${colors[0]})` : 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <Card className={cn('flex min-h-0 flex-1 flex-col gap-3 overflow-hidden py-4', className)}>
      <CardHeader className="shrink-0 px-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col px-4">
        <ChartContainer config={chartConfig} className="aspect-auto! h-full w-full min-h-[12rem]">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={tickLine} axisLine={false} tickMargin={8} tickFormatter={value => value.slice(0, 10)} />
            <YAxis dataKey="l1" tickLine={tickLine} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
            <Area dataKey="l1" type="linear" fill="var(--color-l1)" fillOpacity={0.2} stroke="var(--color-l1)" stackId={'1'} />
            {data[1] && <Area dataKey="l2" type="linear" fill="var(--color-l2)" fillOpacity={0.4} stroke="var(--color-l2)" stackId={'2'} />}

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
