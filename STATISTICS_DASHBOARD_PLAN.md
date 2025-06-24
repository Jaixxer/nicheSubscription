# 📊 Statistics Dashboard Implementation Plan

## Overview
The Statistics Dashboard will be implemented during **Week 10** as one of the two view engine pages, providing real-time analytics and insights for administrators and curators.

---

## 🎯 **Dashboard Features & Components**

### **1. Real-Time Metrics Overview (Top Cards)**
```typescript
interface DashboardMetrics {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  churnRate: number;
  lifetimeValue: number;
  newSubscriptionsToday: number;
}
```

#### **Metrics Cards:**
- **Total Active Subscriptions** (with % change from last month)
- **Monthly Recurring Revenue (MRR)** (with growth trend)
- **Total Users** (split by Curators/Subscribers)
- **Churn Rate** (with trend indicator)
- **Average Customer Lifetime Value (CLV)**
- **Today's New Subscriptions** (real-time counter)

### **2. Revenue Analytics Section**
#### **Charts:**
- **Revenue Trend Chart** (Line chart - last 12 months)
- **Revenue by Product** (Bar chart - top 10 products)
- **Payment Method Distribution** (Pie chart)
- **Monthly vs Annual Revenue** (Stacked bar chart)

### **3. Subscription Analytics Section**
#### **Charts:**
- **Subscription Growth** (Area chart - monthly new subscriptions)
- **Subscription Status Distribution** (Donut chart)
- **Cancellation Reasons** (Horizontal bar chart)
- **Renewal Rates by Plan** (Line chart)

### **4. User Analytics Section**
#### **Charts:**
- **User Registration Trend** (Line chart)
- **User Demographics** (Geographic distribution)
- **User Engagement** (Activity heatmap)
- **Role Distribution** (Pie chart)

### **5. Product Performance Section**
#### **Charts:**
- **Top Performing Products** (Table with sortable columns)
- **Inventory Levels** (Gauge charts for low stock alerts)
- **Product Categories Performance** (Treemap)
- **Average Order Value by Product** (Bar chart)

---

## 🛠️ **Technical Implementation**

### **Backend Implementation (API Endpoints)**

#### **1. Dashboard Controller (`DashboardController`)**
```typescript
@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRoles.Admin, UserRoles.Curator)
export class DashboardController {
  @Get('metrics')
  async getDashboardMetrics(): Promise<DashboardMetrics> {}

  @Get('revenue')
  async getRevenueAnalytics(@Query() filter: AnalyticsFilterDto): Promise<RevenueAnalytics> {}

  @Get('subscriptions')
  async getSubscriptionAnalytics(@Query() filter: AnalyticsFilterDto): Promise<SubscriptionAnalytics> {}

  @Get('users')
  async getUserAnalytics(@Query() filter: AnalyticsFilterDto): Promise<UserAnalytics> {}

  @Get('products')
  async getProductAnalytics(@Query() filter: AnalyticsFilterDto): Promise<ProductAnalytics> {}
}
```

#### **2. Analytics Service with Complex Queries**
```typescript
@Injectable()
export class AnalyticsService {
  // Real-time metrics calculation
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [
      totalUsers,
      activeSubscriptions,
      monthlyRevenue,
      churnRate
    ] = await Promise.all([
      this.getUserCount(),
      this.getActiveSubscriptionCount(),
      this.getMonthlyRevenue(),
      this.calculateChurnRate()
    ]);

    return {
      totalUsers,
      activeSubscriptions,
      monthlyRevenue,
      churnRate,
      lifetimeValue: await this.calculateCLV(),
      newSubscriptionsToday: await this.getTodaySubscriptions()
    };
  }

  // Revenue analytics with time-based aggregation
  async getRevenueAnalytics(filter: AnalyticsFilterDto): Promise<RevenueAnalytics> {
    // Complex SQL queries for revenue trends
  }
}
```

#### **3. WebSocket Gateway for Real-Time Updates**
```typescript
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/dashboard'
})
export class DashboardGateway {
  @SubscribeMessage('subscribe_metrics')
  handleSubscribeMetrics(client: Socket) {
    // Join client to metrics room
    client.join('metrics_updates');
  }

  // Emit real-time updates every 30 seconds
  @Interval(30000)
  async emitMetricsUpdate() {
    const metrics = await this.analyticsService.getDashboardMetrics();
    this.server.to('metrics_updates').emit('metrics_update', metrics);
  }
}
```

### **Frontend Implementation (React + TypeScript)**

#### **1. Dashboard Layout Component**
```tsx
const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const socket = useSocket('/dashboard');

  useEffect(() => {
    // Initial data fetch
    fetchDashboardData();

    // Setup WebSocket for real-time updates
    socket?.on('metrics_update', (newMetrics: DashboardMetrics) => {
      setMetrics(newMetrics);
    });

    return () => socket?.off('metrics_update');
  }, []);

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <MetricsCards metrics={metrics} />
      <ChartsGrid timeRange={selectedTimeRange} />
    </div>
  );
};
```

#### **2. Real-Time Metrics Cards Component**
```tsx
const MetricsCards: React.FC<{ metrics: DashboardMetrics | null }> = ({ metrics }) => {
  return (
    <div className="metrics-grid">
      <MetricCard
        title="Active Subscriptions"
        value={metrics?.activeSubscriptions}
        trend={+12.5}
        icon={<SubscriptionIcon />}
        color="blue"
      />
      <MetricCard
        title="Monthly Revenue"
        value={formatCurrency(metrics?.monthlyRevenue)}
        trend={+8.2}
        icon={<RevenueIcon />}
        color="green"
      />
      {/* Additional metric cards */}
    </div>
  );
};
```

#### **3. Charts Implementation with Recharts**
```tsx
const RevenueChart: React.FC<{ data: RevenueData[], timeRange: string }> = ({ data, timeRange }) => {
  return (
    <div className="chart-container">
      <h3>Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#8884d8" 
            strokeWidth={3}
            dot={{ fill: '#8884d8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
```

#### **4. Advanced Analytics Components**
```tsx
const SubscriptionAnalytics: React.FC = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionAnalytics | null>(null);

  return (
    <div className="analytics-section">
      <div className="charts-row">
        <div className="chart-half">
          <SubscriptionGrowthChart data={subscriptionData?.growth} />
        </div>
        <div className="chart-half">
          <ChurnRateChart data={subscriptionData?.churnRate} />
        </div>
      </div>
      <div className="charts-row">
        <SubscriptionStatusPieChart data={subscriptionData?.statusDistribution} />
      </div>
    </div>
  );
};
```

---

## 🎨 **UI/UX Design Specifications**

### **Design System:**
- **Color Palette:**
  - Primary: `#3B82F6` (Blue)
  - Success: `#10B981` (Green)
  - Warning: `#F59E0B` (Orange)
  - Danger: `#EF4444` (Red)
  - Background: `#F8FAFC` (Light Gray)

### **Layout Structure:**
```scss
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
  }
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}
```

### **Responsive Design:**
- **Desktop (>1200px):** 6 metric cards per row, 2 charts per row
- **Tablet (768px-1200px):** 3 metric cards per row, 1 chart per row
- **Mobile (<768px):** 1 metric card per row, stacked charts

---

## 📱 **Interactive Features**

### **1. Real-Time Updates**
- WebSocket connection for live metric updates
- Visual indicators for data refresh
- Automatic chart updates without page reload

### **2. Time Range Filters**
- Quick filters: Today, 7 days, 30 days, 90 days, 1 year
- Custom date range picker
- URL state management for shareable links

### **3. Drill-Down Capabilities**
- Click on chart elements to get detailed breakdowns
- Modal overlays with additional context
- Contextual tooltips with detailed information

### **4. Export & Sharing**
- Export charts as PNG/PDF
- Generate dashboard reports
- Share dashboard snapshots via email

---

## 🔧 **Implementation Timeline (Week 10)**

### **Day 1-2: Backend Analytics APIs**
- [ ] Create `DashboardController` and `AnalyticsService`
- [ ] Implement complex SQL queries for metrics calculation
- [ ] Setup WebSocket gateway for real-time updates
- [ ] Create analytics DTOs and interfaces

### **Day 3-4: Frontend Dashboard Setup**
- [ ] Setup React dashboard routing
- [ ] Create layout components and grid system
- [ ] Implement authentication guards for dashboard
- [ ] Setup WebSocket connection management

### **Day 5-6: Charts and Visualizations**
- [ ] Implement all chart components with Recharts
- [ ] Add interactive features and animations
- [ ] Implement responsive design
- [ ] Add loading states and error handling

### **Day 7: Polish and Testing**
- [ ] Add final styling and animations
- [ ] Implement export and sharing features
- [ ] Performance optimization
- [ ] End-to-end testing

---

## 📊 **Sample API Responses**

### **Dashboard Metrics Response:**
```json
{
  "totalUsers": 1247,
  "activeSubscriptions": 892,
  "monthlyRevenue": 45670.00,
  "churnRate": 3.2,
  "lifetimeValue": 342.50,
  "newSubscriptionsToday": 23,
  "trends": {
    "usersGrowth": 12.5,
    "revenueGrowth": 8.2,
    "subscriptionGrowth": 15.3,
    "churnChange": -0.8
  }
}
```

### **Revenue Analytics Response:**
```json
{
  "revenueByMonth": [
    { "month": "Jan", "revenue": 42300, "subscriptions": 850 },
    { "month": "Feb", "revenue": 45600, "subscriptions": 892 }
  ],
  "revenueByProduct": [
    { "productName": "Premium Box", "revenue": 18900, "percentage": 41.4 },
    { "productName": "Starter Box", "revenue": 12300, "percentage": 26.9 }
  ],
  "paymentMethods": [
    { "method": "Credit Card", "percentage": 78.5, "amount": 35876 },
    { "method": "PayPal", "percentage": 21.5, "amount": 9794 }
  ]
}
```

This comprehensive dashboard will provide administrators and curators with all the insights they need to make data-driven decisions about their subscription box business. The real-time nature and interactive features make it a powerful tool for monitoring business performance.
