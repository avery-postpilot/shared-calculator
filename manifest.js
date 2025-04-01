import React, { useState } from 'react';

const PostPilotCalculator = () => {
  // State variables for form inputs
  const [brandInfo, setBrandInfo] = useState({
    revenue: '',
    aov: '',
    industry: 'ecommerce',
    targetAudience: 'general',
    goalRoas: 1,
    budgetConstraint: false,
    productType: 'physical',
    hasRepeatCustomers: true,
    existingCustomerCount: '',
  });
  
  // State for results
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({
    recommendedTheme: '',
    recommendedFormat: '',
    estimatedRoas: 0,
    pricingRecommendation: '',
    audienceSize: 0,
    additionalRecommendations: []
  });
  
  // Theme data with historical performance
  const themeData = {
    newMoms: { avgRoas: 47.5, bestFor: ['baby', 'parenting', 'health'], minAov: 50 },
    newMovers: { avgRoas: 14.38, bestFor: ['home', 'furniture', 'decor'], minAov: 100 },
    newYear: { avgRoas: 11.15, bestFor: ['fitness', 'health', 'apparel'], minAov: 40 },
    giftGuide: { avgRoas: 9.07, bestFor: ['apparel', 'accessories', 'luxury'], minAov: 60 },
    travel: { avgRoas: 15.2, bestFor: ['travel', 'luggage', 'outdoor'], minAov: 80 },
    newlyweds: { avgRoas: 18.5, bestFor: ['home', 'registry', 'luxury'], minAov: 120 },
    retirees: { avgRoas: 12.8, bestFor: ['health', 'travel', 'luxury'], minAov: 100 }
  };
  
  // Format options with cost and minimum recommended audience size
  const formatOptions = {
    postcard: { cost: 0.586, minSize: 50000, recommended: 'Low budget, simple offer' },
    cardalog: { cost: 0.774, minSize: 50000, recommended: 'Multiple products, lifestyle focus' },
    miniCatalog: { cost: 0.82, minSize: 50000, recommended: 'Premium brands, complex offers' }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBrandInfo({
      ...brandInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Calculate recommended strategy
  const calculateStrategy = () => {
    // Parse inputs
    const annualRevenue = parseFloat(brandInfo.revenue);
    const aov = parseFloat(brandInfo.aov);
    
    // Determine recommended theme based on industry and AOV
    let bestTheme = 'newMovers';
    let highestScore = 0;
    
    Object.entries(themeData).forEach(([theme, data]) => {
      let score = 0;
      
      // Score based on industry match
      if (data.bestFor.includes(brandInfo.industry)) score += 5;
      
      // Score based on AOV threshold
      if (aov >= data.minAov) score += 3;
      
      // Adjust score based on average ROAS performance
      score += (data.avgRoas / 10);
      
      // Special adjustments based on target audience
      if (brandInfo.targetAudience === 'new_parents' && theme === 'newMoms') score += 10;
      if (brandInfo.targetAudience === 'home_buyers' && theme === 'newMovers') score += 10;
      if (brandInfo.targetAudience === 'gift_givers' && theme === 'giftGuide') score += 8;
      if (brandInfo.targetAudience === 'health_conscious' && theme === 'newYear') score += 7;
      if (brandInfo.targetAudience === 'travelers' && theme === 'travel') score += 10;
      if (brandInfo.targetAudience === 'newlyweds' && theme === 'newlyweds') score += 10;
      if (brandInfo.targetAudience === 'retirees' && theme === 'retirees') score += 10;
      
      // Update best theme if current theme has higher score
      if (score > highestScore) {
        highestScore = score;
        bestTheme = theme;
      }
    });
    
    // Determine recommended format based on AOV and annual revenue
    let recommendedFormat = 'cardalog';
    if (annualRevenue > 20000000 || aov > 150) {
      recommendedFormat = 'miniCatalog';
    } else if (annualRevenue < 5000000 && brandInfo.budgetConstraint) {
      recommendedFormat = 'postcard';
    }
    
    // Calculate estimated ROAS
    let estimatedRoas = themeData[bestTheme].avgRoas;
    
    // Adjust ROAS based on AOV
    if (aov > themeData[bestTheme].minAov * 2) {
      estimatedRoas *= 1.3; // 30% boost for high AOV
    } else if (aov < themeData[bestTheme].minAov) {
      estimatedRoas *= 0.7; // 30% reduction for below min AOV
    }
    
    // Determine audience size based on annual revenue
    let audienceSize = 50000;
    if (annualRevenue > 20000000) {
      audienceSize = 200000;
    } else if (annualRevenue > 5000000) {
      audienceSize = 100000;
    }
    
    // Determine pricing recommendation
    let pricingRecommendation = '';
    if (annualRevenue > 20000000) {
      pricingRecommendation = '$15,000 base + 5% revenue share';
    } else if (annualRevenue > 5000000) {
      pricingRecommendation = '$8,000 base OR 10% revenue share';
    } else {
      pricingRecommendation = '$3,000 base OR 15% revenue share';
    }
    
    // Additional recommendations
    const additionalRecommendations = [];
    
    if (aov > 100) {
      additionalRecommendations.push('Consider premium placement options for high-value products');
    }
    
    if (brandInfo.hasRepeatCustomers) {
      additionalRecommendations.push('Include a special offer for first-time customers to drive new acquisition');
    }
    
    if (estimatedRoas > 20) {
      additionalRecommendations.push('Your brand profile suggests high potential - consider multi-campaign commitment for best placements');
    }
    
    if (bestTheme === 'newMoms') {
      additionalRecommendations.push('New Moms is our highest performing segment with 47.5x average ROAS - highly recommended');
    }
    
    // Set results
    setResults({
      recommendedTheme: formatThemeName(bestTheme),
      recommendedFormat,
      estimatedRoas: Math.round(estimatedRoas * 10) / 10,
      pricingRecommendation,
      audienceSize,
      additionalRecommendations
    });
    
    setShowResults(true);
  };
  
  // Format theme name for display
  const formatThemeName = (theme) => {
    switch(theme) {
      case 'newMoms': return 'New Moms';
      case 'newMovers': return 'New Movers';
      case 'newYear': return 'New Year New You';
      case 'giftGuide': return 'Gift Guide';
      case 'travel': return 'Travel & Adventure';
      case 'newlyweds': return 'Newlyweds';
      case 'retirees': return 'Recent Retirees';
      default: return theme;
    }
  };
  
  // Format audience size for display
  const formatAudienceSize = (size) => {
    return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateStrategy();
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-800">PostPilot</div>
            <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">The Picks</div>
          </div>
          <div className="text-sm text-gray-500">Shared Mailer Strategy Calculator</div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Ideal Shared Mailer Strategy</h1>
          
          {!showResults ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Annual Revenue */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Revenue ($)
                    </label>
                    <input
                      type="number"
                      name="revenue"
                      value={brandInfo.revenue}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Average Order Value */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Average Order Value ($)
                    </label>
                    <input
                      type="number"
                      name="aov"
                      value={brandInfo.aov}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Industry */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Industry
                    </label>
                    <select
                      name="industry"
                      value={brandInfo.industry}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ecommerce">General E-commerce</option>
                      <option value="baby">Baby & Parenting</option>
                      <option value="home">Home & Furnishings</option>
                      <option value="apparel">Apparel & Fashion</option>
                      <option value="beauty">Beauty & Skincare</option>
                      <option value="health">Health & Wellness</option>
                      <option value="fitness">Fitness & Sports</option>
                      <option value="food">Food & Beverages</option>
                      <option value="travel">Travel & Luggage</option>
                      <option value="outdoor">Outdoor & Recreation</option>
                      <option value="tech">Electronics & Tech</option>
                      <option value="decor">Home Decor</option>
                      <option value="luxury">Luxury Goods</option>
                      <option value="furniture">Furniture</option>
                      <option value="accessories">Accessories</option>
                      <option value="registry">Wedding/Registry</option>
                    </select>
                  </div>
                  
                  {/* Target Audience */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Audience
                    </label>
                    <select
                      name="targetAudience"
                      value={brandInfo.targetAudience}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general">General Consumers</option>
                      <option value="new_parents">New Parents</option>
                      <option value="home_buyers">New Home Buyers</option>
                      <option value="health_conscious">Health & Fitness Enthusiasts</option>
                      <option value="gift_givers">Gift Shoppers</option>
                      <option value="travelers">Travel Enthusiasts</option>
                      <option value="newlyweds">Newlyweds & Engaged Couples</option>
                      <option value="retirees">Recent Retirees</option>
                    </select>
                  </div>
                  
                  {/* Goal ROAS */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target ROAS
                    </label>
                    <select
                      name="goalRoas"
                      value={brandInfo.goalRoas}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="1">1x (Break Even)</option>
                      <option value="2">2x</option>
                      <option value="3">3x</option>
                      <option value="5">5x</option>
                      <option value="10">10x+</option>
                    </select>
                  </div>
                  
                  {/* Budget Constraint */}
                  <div className="col-span-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="budgetConstraint"
                        checked={brandInfo.budgetConstraint}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Budget Constrained</span>
                    </label>
                  </div>
                  
                  {/* Product Type */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Type
                    </label>
                    <select
                      name="productType"
                      value={brandInfo.productType}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="physical">Physical Products</option>
                      <option value="subscription">Subscription Service</option>
                      <option value="hybrid">Hybrid (Products & Services)</option>
                    </select>
                  </div>
                  
                  {/* Has Repeat Customers */}
                  <div className="col-span-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="hasRepeatCustomers"
                        checked={brandInfo.hasRepeatCustomers}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Has Repeat Customers</span>
                    </label>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Calculate Optimal Strategy
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* Results Header */}
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Your Recommended Shared Mailer Strategy</h2>
              </div>
              
              {/* Results Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recommended Theme */}
                  <div className="col-span-1 bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-800 mb-1">Recommended Theme</h3>
                    <p className="text-xl font-bold text-gray-900">{results.recommendedTheme}</p>
                  </div>
                  
                  {/* Recommended Format */}
                  <div className="col-span-1 bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-800 mb-1">Recommended Format</h3>
                    <p className="text-xl font-bold text-gray-900 capitalize">{results.recommendedFormat}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatOptions[results.recommendedFormat].recommended}</p>
                  </div>
                  
                  {/* Estimated ROAS */}
                  <div className="col-span-1 bg-green-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-green-800 mb-1">Estimated ROAS</h3>
                    <p className="text-xl font-bold text-gray-900">{results.estimatedRoas}x</p>
                  </div>
                  
                  {/* Audience Size */}
                  <div className="col-span-1 bg-green-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-green-800 mb-1">Recommended Audience Size</h3>
                    <p className="text-xl font-bold text-gray-900">{formatAudienceSize(results.audienceSize)} households</p>
                  </div>
                  
                  {/* Pricing Recommendation */}
                  <div className="col-span-2 bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-800 mb-1">Pricing Recommendation</h3>
                    <p className="text-xl font-bold text-gray-900">{results.pricingRecommendation}</p>
                  </div>
                  
                  {/* Additional Recommendations */}
                  <div className="col-span-2">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Strategic Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {results.additionalRecommendations.map((rec, index) => (
                        <li key={index} className="text-gray-700">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Campaign Cost Estimate */}
                <div className="mt-8 p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Campaign Cost Estimate</h3>
                  <p className="text-gray-700">
                    Base campaign cost: <span className="font-semibold">${Math.round(results.audienceSize * formatOptions[results.recommendedFormat].cost).toLocaleString()}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on {formatAudienceSize(results.audienceSize)} households at ${formatOptions[results.recommendedFormat].cost.toFixed(3)} per piece
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowResults(false)}
                    className="flex-1 bg-white border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Recalculate
                  </button>
                  <button
                    onClick={() => window.location.href = "mailto:sales@postpilot.com?subject=Shared Mailer Inquiry&body=I'm interested in learning more about The Picks shared mailer program."}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Contact Sales Team
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="text-xl font-bold">PostPilot</div>
                <div className="ml-2 px-2 py-1 bg-blue-700 text-xs font-semibold rounded">The Picks</div>
              </div>
              <div className="text-xs text-gray-400 mt-1">Dynamic Direct Mail Made Easy for E-Commerce</div>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} PostPilot. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PostPilotCalculator;
