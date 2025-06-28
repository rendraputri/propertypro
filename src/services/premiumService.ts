import { PremiumListing, PremiumPlan, PaymentData, BillingDetails } from '../types/premium';

class PremiumService {
  private premiumListings: PremiumListing[] = [];
  private payments: PaymentData[] = [];

  // Premium plans configuration
  getPremiumPlans(): PremiumPlan[] {
    return [
      {
        id: 'premium-monthly',
        name: 'Premium Listing',
        price: 29.99,
        currency: 'USD',
        duration: 30,
        description: 'Boost your property visibility with premium features',
        features: [
          'Featured placement at top of search results',
          'Golden highlighted border',
          'Larger photo gallery (up to 20 images)',
          'Extended listing duration (30 days)',
          'Virtual tour integration',
          'Detailed analytics dashboard',
          'Priority customer support',
          'Social media promotion'
        ]
      }
    ];
  }

  async createPremiumListing(data: {
    propertyId: string;
    userId: string;
    planId: string;
    paymentId: string;
  }): Promise<PremiumListing> {
    const plan = this.getPremiumPlans().find(p => p.id === data.planId);
    if (!plan) {
      throw new Error('Premium plan not found');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);

    const premiumListing: PremiumListing = {
      id: `premium-${Date.now()}`,
      propertyId: data.propertyId,
      userId: data.userId,
      plan,
      status: 'active',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      paymentId: data.paymentId,
      features: [
        { id: 'featured', name: 'Featured Placement', description: 'Top of search results', icon: 'Star', enabled: true },
        { id: 'highlight', name: 'Highlighted Border', description: 'Golden border styling', icon: 'Crown', enabled: true },
        { id: 'gallery', name: 'Extended Gallery', description: 'Up to 20 images', icon: 'Image', enabled: true },
        { id: 'duration', name: 'Extended Duration', description: '30 days listing', icon: 'Calendar', enabled: true },
        { id: 'analytics', name: 'Analytics Dashboard', description: 'Detailed insights', icon: 'BarChart', enabled: true },
        { id: 'virtual-tour', name: 'Virtual Tour', description: '360° property view', icon: 'Eye', enabled: true }
      ],
      analytics: {
        views: 0,
        inquiries: 0,
        favorites: 0,
        conversionRate: 0,
        dailyViews: [],
        topSources: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.premiumListings.push(premiumListing);
    return premiumListing;
  }

  async createPayment(data: {
    orderId: string;
    amount: number;
    currency: string;
    billingDetails: BillingDetails;
  }): Promise<PaymentData> {
    const payment: PaymentData = {
      id: `payment-${Date.now()}`,
      orderId: data.orderId,
      amount: data.amount,
      currency: data.currency,
      status: 'pending',
      paymentMethod: '',
      billingDetails: data.billingDetails,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.payments.push(payment);
    return payment;
  }

  async updatePaymentStatus(paymentId: string, status: PaymentData['status'], transactionId?: string): Promise<PaymentData> {
    const payment = this.payments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = status;
    payment.transactionId = transactionId;
    payment.updatedAt = new Date().toISOString();

    return payment;
  }

  getPremiumListing(propertyId: string): PremiumListing | null {
    return this.premiumListings.find(
      listing => listing.propertyId === propertyId && 
      listing.status === 'active' && 
      new Date(listing.endDate) > new Date()
    ) || null;
  }

  getUserPremiumListings(userId: string): PremiumListing[] {
    return this.premiumListings.filter(listing => listing.userId === userId);
  }

  getUserPayments(userId: string): PaymentData[] {
    const userListings = this.getUserPremiumListings(userId);
    const paymentIds = userListings.map(listing => listing.paymentId);
    return this.payments.filter(payment => paymentIds.includes(payment.id));
  }

  async updateAnalytics(propertyId: string, type: 'view' | 'inquiry' | 'favorite'): Promise<void> {
    const listing = this.premiumListings.find(l => l.propertyId === propertyId);
    if (!listing) return;

    switch (type) {
      case 'view':
        listing.analytics.views++;
        break;
      case 'inquiry':
        listing.analytics.inquiries++;
        break;
      case 'favorite':
        listing.analytics.favorites++;
        break;
    }

    // Update daily views
    const today = new Date().toISOString().split('T')[0];
    const todayViews = listing.analytics.dailyViews.find(d => d.date === today);
    if (todayViews) {
      todayViews.views++;
    } else {
      listing.analytics.dailyViews.push({ date: today, views: 1 });
    }

    // Calculate conversion rate
    if (listing.analytics.views > 0) {
      listing.analytics.conversionRate = (listing.analytics.inquiries / listing.analytics.views) * 100;
    }

    listing.updatedAt = new Date().toISOString();
  }

  checkExpiredListings(): void {
    const now = new Date();
    this.premiumListings.forEach(listing => {
      if (listing.status === 'active' && new Date(listing.endDate) <= now) {
        listing.status = 'expired';
        listing.updatedAt = now.toISOString();
      }
    });
  }
}

export const premiumService = new PremiumService();