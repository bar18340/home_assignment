import { ProcessedData, Rectangle, IssueType, RectangleWithIssues } from '../types';

export class SVGProcessor {
  static processSVG(svgContent: string): ProcessedData {
    // Extract SVG dimensions
    const svgMatch = svgContent.match(/<svg[^>]*width="(\d+)"[^>]*height="(\d+)"/);
    if (!svgMatch) {
      throw new Error('Invalid SVG: missing width or height attributes');
    }

    const svgWidth = parseInt(svgMatch[1], 10);
    const svgHeight = parseInt(svgMatch[2], 10);

    // Extract rectangles
    const rectRegex = /<rect[^>]*x="(\d+)"[^>]*y="(\d+)"[^>]*width="(\d+)"[^>]*height="(\d+)"[^>]*fill="([^"]+)"[^>]*\/?>|<rect[^>]*fill="([^"]+)"[^>]*x="(\d+)"[^>]*y="(\d+)"[^>]*width="(\d+)"[^>]*height="(\d+)"[^>]*\/?>/g;
    const items: RectangleWithIssues[] = [];
    let match;

    while ((match = rectRegex.exec(svgContent)) !== null) {
      let rect: Rectangle;

      // Handle both attribute orders
      if (match[1]) {
        rect = {
          x: parseInt(match[1], 10),
          y: parseInt(match[2], 10),
          width: parseInt(match[3], 10),
          height: parseInt(match[4], 10),
          fill: match[5]
        };
      } else {
        rect = {
          x: parseInt(match[7], 10),
          y: parseInt(match[8], 10),
          width: parseInt(match[9], 10),
          height: parseInt(match[10], 10),
          fill: match[6]
        };
      }

      // Check for out of bounds
      const issues: IssueType[] = [];
      if (rect.x + rect.width > svgWidth || rect.y + rect.height > svgHeight) {
        issues.push(IssueType.OUT_OF_BOUNDS);
      }

      items.push({
        ...rect,
        issues: issues.length > 0 ? issues : undefined
      });
    }

    const itemsCount = items.length;

    // Calculate coverage ratio
    const canvasArea = svgWidth * svgHeight;
    const totalRectArea = items.reduce((sum, rect) => sum + (rect.width * rect.height), 0);
    const coverageRatio = canvasArea > 0 ? totalRectArea / canvasArea : 0;

    // Detect global issues
    const globalIssues: IssueType[] = [];
    if (itemsCount === 0) {
      globalIssues.push(IssueType.EMPTY);
    }
    if (items.some(item => item.issues?.includes(IssueType.OUT_OF_BOUNDS))) {
      globalIssues.push(IssueType.OUT_OF_BOUNDS);
    }

    return {
      svgWidth,
      svgHeight,
      items,
      itemsCount,
      coverageRatio,
      issues: globalIssues
    };
  }
}
