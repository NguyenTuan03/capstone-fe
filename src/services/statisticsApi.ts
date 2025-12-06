import {
  StatisticsData,
  GetStatisticsParams,
  GetStatisticsResponse,
  StatisticsFilters,
  StatisticsApiResponse,
  ChartType,
  Chart3DConfig,
} from '@/types/statistics';
import { statisticsData } from '@/data/statistics';

// Simulate API delay
const simulateDelay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const allStatistics = statisticsData as any as StatisticsData;

export class StatisticsApiService {
  /**
   * Get comprehensive statistics data
   */
  static async getStatistics(params?: GetStatisticsParams): Promise<GetStatisticsResponse> {
    await simulateDelay();

    try {
      let filteredData = { ...allStatistics };

      // Apply filters if provided
      if (params?.filters) {
        filteredData = this.applyFilters(filteredData, params.filters);
      }

      // Apply date range filter
      if (params?.dateRange) {
        filteredData = this.applyDateRangeFilter(filteredData, params.dateRange);
      }

      // Filter metrics if specified
      if (params?.metrics && params.metrics.length > 0) {
        filteredData = this.filterMetrics(filteredData, params.metrics);
      }

      // Add real-time data if requested
      if (params?.includeRealTime) {
        filteredData.timeSeriesData.realTime = await this.getRealTimeData();
      }

      // Add predictions if requested
      if (params?.includePredictions) {
        filteredData.timeSeriesData.predictions = await this.getPredictions();
      }

      // Add geographic data if requested
      if (params?.includeGeographic) {
        filteredData.geographicData = (await this.getGeographicData()) as any;
      }

      return {
        success: true,
        data: filteredData,
        lastUpdated: new Date().toISOString(),
        nextUpdate: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
        cacheExpiry: 300, // 5 minutes in seconds
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw new Error('Failed to fetch statistics data');
    }
  }

  /**
   * Get overview statistics only
   */
  static async getOverviewStats(): Promise<StatisticsApiResponse> {
    await simulateDelay(50);

    try {
      return {
        success: true,
        message: 'Overview statistics retrieved successfully',
        data: allStatistics.overview,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch overview statistics',
      };
    }
  }

  /**
   * Get user analytics data
   */
  static async getUserAnalytics(filters?: StatisticsFilters): Promise<StatisticsApiResponse> {
    await simulateDelay();

    try {
      let userAnalytics = { ...allStatistics.userAnalytics };

      if (filters) {
        userAnalytics = this.filterUserAnalytics(userAnalytics, filters);
      }

      return {
        success: true,
        message: 'User analytics retrieved successfully',
        data: userAnalytics,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch user analytics',
      };
    }
  }

  /**
   * Get session analytics data
   */
  static async getSessionAnalytics(filters?: StatisticsFilters): Promise<StatisticsApiResponse> {
    await simulateDelay();

    try {
      let sessionAnalytics = { ...allStatistics.sessionAnalytics };

      if (filters) {
        sessionAnalytics = this.filterSessionAnalytics(sessionAnalytics, filters);
      }

      return {
        success: true,
        message: 'Session analytics retrieved successfully',
        data: sessionAnalytics,
      };
    } catch (error) {
      console.error('Error fetching session analytics:', error);
      return {
        success: false,
        message: 'Failed to fetch session analytics',
      };
    }
  }

  /**
   * Get revenue analytics data
   */
  static async getRevenueAnalytics(dateRange?: [string, string]): Promise<StatisticsApiResponse> {
    await simulateDelay();

    try {
      let revenueAnalytics = { ...allStatistics.revenueAnalytics };

      if (dateRange) {
        revenueAnalytics = this.filterRevenueByDateRange(revenueAnalytics, dateRange);
      }

      return {
        success: true,
        message: 'Revenue analytics retrieved successfully',
        data: revenueAnalytics,
      };
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return {
        success: false,
        message: 'Failed to fetch revenue analytics',
      };
    }
  }

  /**
   * Get engagement analytics data
   */
  static async getEngagementAnalytics(): Promise<StatisticsApiResponse> {
    await simulateDelay();

    try {
      return {
        success: true,
        message: 'Engagement analytics retrieved successfully',
        data: allStatistics.engagementAnalytics,
      };
    } catch (error) {
      console.error('Error fetching engagement analytics:', error);
      return {
        success: false,
        message: 'Failed to fetch engagement analytics',
      };
    }
  }

  /**
   * Get geographic data
   */
  static async getGeographicData(): Promise<StatisticsApiResponse> {
    await simulateDelay();

    try {
      return {
        success: true,
        message: 'Geographic data retrieved successfully',
        data: allStatistics.geographicData,
      };
    } catch (error) {
      console.error('Error fetching geographic data:', error);
      return {
        success: false,
        message: 'Failed to fetch geographic data',
      };
    }
  }

  /**
   * Get real-time data
   */
  static async getRealTimeData(): Promise<any> {
    await simulateDelay(30);

    // Simulate real-time variations
    const baseData = allStatistics.timeSeriesData.realTime;
    const variation = () => Math.floor(Math.random() * 20) - 10; // -10 to +10

    return {
      ...baseData,
      activeUsers: Math.max(0, baseData.activeUsers + variation()),
      activeSessions: Math.max(0, baseData.activeSessions + Math.floor(variation() / 2)),
      serverLoad: Math.max(0, Math.min(100, baseData.serverLoad + variation() * 0.5)),
      responseTime: Math.max(50, baseData.responseTime + variation()),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get predictions data
   */
  static async getPredictions(): Promise<any> {
    await simulateDelay(80);
    return allStatistics.timeSeriesData.predictions;
  }

  /**
   * Get 3D chart configuration
   */
  static async getChart3DConfig(chartType: ChartType): Promise<Chart3DConfig> {
    await simulateDelay(30);

    const baseConfig: Chart3DConfig = {
      type: chartType,
      title: this.getChartTitle(chartType),
      dimensions: {
        width: 800,
        height: 600,
        depth: 400,
        scale: 1,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
      },
      colors: {
        primary: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'],
        secondary: ['#91d5ff', '#b7eb8f', '#ffd666', '#ff7875', '#d3adf7', '#87e8de'],
        gradients: [
          { name: 'blue', colors: ['#1890ff', '#40a9ff'], direction: 'vertical' },
          { name: 'green', colors: ['#52c41a', '#73d13d'], direction: 'vertical' },
          { name: 'gold', colors: ['#faad14', '#ffc53d'], direction: 'vertical' },
        ],
        materials: [
          {
            name: 'standard',
            type: 'standard',
            properties: { metalness: 0.3, roughness: 0.4, opacity: 0.9 },
          },
          {
            name: 'glass',
            type: 'physical',
            properties: { metalness: 0, roughness: 0, opacity: 0.7, transparent: true },
          },
          {
            name: 'metal',
            type: 'standard',
            properties: { metalness: 0.8, roughness: 0.2, opacity: 1 },
          },
        ],
      },
      animations: {
        enabled: true,
        duration: 1000,
        easing: 'ease-out',
        delay: 0,
        loop: false,
        autoStart: true,
      },
      interactions: {
        hover: true,
        click: true,
        drag: false,
        zoom: true,
        rotate: true,
        pan: true,
        tooltips: true,
        selection: true,
      },
      camera: {
        position: [10, 10, 10],
        target: [0, 0, 0],
        fov: 75,
        near: 0.1,
        far: 1000,
        controls: 'orbit',
      },
      lighting: {
        ambient: { color: '#404040', intensity: 0.4 },
        directional: [
          {
            color: '#ffffff',
            intensity: 1,
            position: [10, 10, 5],
            castShadow: true,
          },
        ],
        point: [
          {
            color: '#ffffff',
            intensity: 0.5,
            position: [0, 10, 0],
            castShadow: false,
          },
        ],
        spot: [],
      },
    };

    return this.customizeChartConfig(baseConfig, chartType);
  }

  // Private helper methods
  private static applyFilters(data: StatisticsData, filters: StatisticsFilters): StatisticsData {
    // Apply user type filters
    if (filters.userTypes && filters.userTypes.length > 0) {
      data.userAnalytics.userGrowth.byType = data.userAnalytics.userGrowth.byType.filter((type) =>
        filters.userTypes!.includes(type.type),
      );
    }

    // Apply country filters
    if (filters.countries && filters.countries.length > 0) {
      data.geographicData.countries = data.geographicData.countries.filter((country) =>
        filters.countries!.includes(country.code),
      );
    }

    return data;
  }

  private static applyDateRangeFilter(
    data: StatisticsData,
    dateRange: [string, string],
  ): StatisticsData {
    const [startDate, endDate] = dateRange;

    // Filter monthly data
    data.userAnalytics.userGrowth.monthly = data.userAnalytics.userGrowth.monthly.filter(
      (month) => month.date >= startDate && month.date <= endDate,
    );

    data.revenueAnalytics.revenueStreams.monthly =
      data.revenueAnalytics.revenueStreams.monthly.filter(
        (month) => month.date >= startDate && month.date <= endDate,
      );

    return data;
  }

  private static filterMetrics(data: StatisticsData, metrics: string[]): StatisticsData {
    const filteredData: any = {};

    metrics.forEach((metric) => {
      switch (metric) {
        case 'users':
          filteredData.userAnalytics = data.userAnalytics;
          break;
        case 'sessions':
          filteredData.sessionAnalytics = data.sessionAnalytics;
          break;
        case 'revenue':
          filteredData.revenueAnalytics = data.revenueAnalytics;
          break;
        case 'engagement':
          filteredData.engagementAnalytics = data.engagementAnalytics;
          break;
        case 'geographic':
          filteredData.geographicData = data.geographicData;
          break;
      }
    });

    return { ...data, ...filteredData };
  }

  private static filterUserAnalytics(userAnalytics: any, filters: StatisticsFilters): any {
    if (filters.platforms && filters.platforms.length > 0) {
      userAnalytics.userDistribution.platforms = userAnalytics.userDistribution.platforms.filter(
        (platform: any) => filters.platforms!.includes(platform.name),
      );
    }

    return userAnalytics;
  }

  private static filterSessionAnalytics(sessionAnalytics: any, filters: StatisticsFilters): any {
    if (filters.sessionTypes && filters.sessionTypes.length > 0) {
      sessionAnalytics.sessionTypes.types = sessionAnalytics.sessionTypes.types.filter(
        (type: any) => filters.sessionTypes!.includes(type.type),
      );
    }

    return sessionAnalytics;
  }

  private static filterRevenueByDateRange(revenueAnalytics: any, dateRange: [string, string]): any {
    const [startDate, endDate] = dateRange;

    revenueAnalytics.revenueStreams.monthly = revenueAnalytics.revenueStreams.monthly.filter(
      (month: any) => month.date >= startDate && month.date <= endDate,
    );

    return revenueAnalytics;
  }

  private static getChartTitle(chartType: ChartType): string {
    const titles = {
      '3d-bar': '3D Bar Chart',
      '3d-donut': '3D Donut Chart',
      '3d-heatmap': '3D Heatmap',
      '3d-globe': '3D Globe Visualization',
      '3d-spiral': '3D Spiral Chart',
      '3d-flow': '3D Flow Diagram',
      '3d-scatter': '3D Scatter Plot',
      '3d-surface': '3D Surface Plot',
    };

    return titles[chartType] || '3D Chart';
  }

  private static customizeChartConfig(config: Chart3DConfig, chartType: ChartType): Chart3DConfig {
    switch (chartType) {
      case '3d-bar':
        config.camera.position = [8, 8, 8];
        config.dimensions.height = 400;
        break;
      case '3d-donut':
        config.camera.position = [0, 0, 10];
        config.animations.duration = 1500;
        break;
      case '3d-heatmap':
        config.camera.position = [0, 15, 0];
        config.interactions.rotate = false;
        break;
      case '3d-globe':
        config.camera.position = [0, 0, 15];
        config.animations.loop = true;
        config.animations.duration = 20000;
        break;
      case '3d-spiral':
        config.camera.position = [10, 15, 10];
        config.animations.duration = 2000;
        break;
      case '3d-flow':
        config.camera.position = [15, 5, 10];
        config.interactions.pan = true;
        break;
      case '3d-scatter':
        config.camera.position = [12, 8, 12];
        config.interactions.selection = true;
        break;
      case '3d-surface':
        config.camera.position = [0, 20, 0];
        config.lighting.directional[0].intensity = 1.5;
        break;
    }

    return config;
  }

  /**
   * Utility functions
   */
  static formatNumber(value: number, format?: 'number' | 'currency' | 'percentage'): string {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('vi-VN').format(value);
    }
  }

  static getTimeAgo(timestamp: string): string {
    if (!timestamp) return 'Chưa có dữ liệu';

    const now = new Date();
    const time = new Date(timestamp);

    if (isNaN(time.getTime())) return 'Dữ liệu không hợp lệ';

    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;

    return time.toLocaleDateString('vi-VN');
  }

  static getTrendDirection(current: number, previous: number): 'up' | 'down' | 'stable' {
    const change = ((current - previous) / previous) * 100;
    if (change > 1) return 'up';
    if (change < -1) return 'down';
    return 'stable';
  }

  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  static generateColor(index: number, total: number, opacity: number = 1): string {
    const hue = (index * 360) / total;
    return `hsla(${hue}, 70%, 50%, ${opacity})`;
  }

  static interpolateColor(color1: string, color2: string, factor: number): string {
    // Simple color interpolation for gradients
    // This is a simplified version - in production, use a proper color library
    return factor < 0.5 ? color1 : color2;
  }

  static convertToCartesian(
    lat: number,
    lng: number,
    radius: number = 5,
  ): [number, number, number] {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return [x, y, z];
  }

  static generateSpiralPoints(data: any[], turns: number = 3): any[] {
    return data.map((item, index) => {
      const t = (index / (data.length - 1)) * turns * 2 * Math.PI;
      const radius = 1 + (index / data.length) * 4;
      const height = (index / data.length) * 8;

      return {
        ...item,
        position: [radius * Math.cos(t), height, radius * Math.sin(t)],
      };
    });
  }
}

export default StatisticsApiService;
