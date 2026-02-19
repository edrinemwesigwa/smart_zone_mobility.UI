import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-technical-guide",
  template: `
    <div class="technical-guide-container">
      <!-- Header -->
      <div class="header">
        <h1>Smart Mobility Simulator</h1>
        <h2>Technical Deep-Dive: How the System Works</h2>
        <p class="date">Document Version 1.0 | February 2026</p>
      </div>

      <!-- Section 1: Simulation Engine Structure -->
      <section class="content-section">
        <h3>1. Simulation Engine Structure</h3>

        <h4>How Congestion Reduction is Calculated (Step-by-Step)</h4>

        <div class="technical-box">
          <h5>Technical Explanation</h5>
          <p>
            The simulation engine calculates congestion reduction through a
            multi-step deterministic process:
          </p>
          <pre class="formula">
Step 1: Calculate Base Traffic Volume
        Baseline Volume × (1 - Exemption Rate) = Affected Volume

Step 2: Apply Price Elasticity
        Affected Volume × Price Elasticity Factor × Pricing Level = Volume Reduction

Step 3: Apply Diversion Logic
        Volume Reduction × (1 - Diversion Threshold) = Diverted Traffic
        Volume Reduction × Diversion Threshold = Removed Trips

Step 4: Apply Time Multipliers
        Reduced Volume × Peak Hour Multiplier × Time-of-Day Factor = Final Congestion Reduction

Step 5: Calculate Downstream Effects
        Diverted Traffic × Secondary Diversion Rate = Secondary Reduction
        Total Reduction = Direct + Secondary</pre
          >
        </div>

        <div class="plain-box">
          <h5>Plain Language Explanation</h5>
          <p>Think of it like a water pipe system:</p>
          <ul>
            <li>
              <strong>Start with total traffic</strong> (all cars entering the
              zone)
            </li>
            <li>
              <strong>Remove exempt vehicles</strong> (buses, emergency vehicles
              don't pay)
            </li>
            <li>
              <strong>Apply price sensitivity</strong> (higher prices = more
              drivers choose alternatives)
            </li>
            <li>
              <strong>Split into two groups</strong>: drivers who reroute vs.
              drivers who cancel trips
            </li>
            <li>
              <strong>Apply time factors</strong> (rush hour matters more than 2
              AM)
            </li>
            <li>
              <strong>Add ripple effects</strong> (less traffic on side roads
              too)
            </li>
          </ul>
        </div>

        <h4>How Pricing Affects Driver Behavior</h4>

        <div class="two-column">
          <div class="column">
            <h5>Technical</h5>
            <ul>
              <li>Price increases the effective cost of driving</li>
              <li>Drivers weigh monetary cost against trip utility</li>
              <li>Behavioral response varies by trip purpose</li>
              <li>
                Response is not linear—threshold prices cause step-change
                reductions
              </li>
            </ul>
          </div>
          <div class="column">
            <h5>Plain Language</h5>
            <ul>
              <li>
                "Is this trip worth AED 10?" (for coffee run probably not)
              </li>
              <li>
                "Is this trip worth AED 20?" (maybe for urgent appointment)
              </li>
              <li>"Is this trip worth AED 50?" (only for true emergencies)</li>
            </ul>
          </div>
        </div>

        <div class="meeting-tip">
          <strong>How to say this in a meeting:</strong>
          <blockquote>
            "Our simulation engine uses a deterministic calculation based on
            price elasticity principles established in international congestion
            pricing implementations. We start with baseline traffic, remove
            exempt vehicles, apply behavioral response factors based on pricing
            levels, and then adjust for time-of-day multipliers to reflect
            realistic driver flexibility. The model is structured for
            transparency—every assumption is visible and adjustable."
          </blockquote>
        </div>
      </section>

      <!-- Section 2: Inputs -->
      <section class="content-section">
        <h3>2. Inputs</h3>

        <div class="input-item">
          <h4>Zone Traffic Baseline Volume</h4>
          <p>
            <strong>What it is:</strong> The total number of vehicles entering
            the pricing zone during a defined period.
          </p>
          <p>
            <strong>Why it matters:</strong> This is the denominator for all
            calculations. A zone with 100,000 daily trips will generate more
            revenue and impact than one with 10,000 trips.
          </p>
          <p class="meeting-point">
            <strong>Meeting talking point:</strong> "We use baseline traffic
            volumes from transport authority estimates, which can be customized
            for different time periods or adjusted based on specific zone
            characteristics."
          </p>
        </div>

        <div class="input-item">
          <h4>Pricing Level</h4>
          <p>
            <strong>What it is:</strong> The charge amount (in AED) applied to
            each vehicle entry during priced hours.
          </p>
          <p>
            <strong>Why it matters:</strong> This is the primary lever. Higher
            prices = more reduction but also more political resistance.
          </p>
          <p class="meeting-point">
            <strong>Meeting talking point:</strong> "Pricing levels can be
            configured to test different scenarios—from modest charges of AED 5
            to premium charges of AED 50 or more."
          </p>
        </div>

        <div class="input-item">
          <h4>Time of Day</h4>
          <p>
            <strong>What it is:</strong> The hour(s) when pricing is active.
          </p>
          <p>
            <strong>Why it matters:</strong> Traffic volume and price
            sensitivity vary dramatically by time.
          </p>
          <p class="meeting-point">
            <strong>Meeting talking point:</strong> "Our system allows granular
            time configuration—we can model all-day pricing, peak-only pricing,
            or any combination."
          </p>
        </div>

        <div class="input-item">
          <h4>Exemption Percentage</h4>
          <p>
            <strong>What it is:</strong> The percentage of vehicles excluded
            from charges.
          </p>
          <p>
            <strong>Why it matters:</strong> Exemptions reduce revenue but are
            often politically required.
          </p>
          <p class="meeting-point">
            <strong>Meeting talking point:</strong> "We model exemptions
            realistically—the system accounts for public buses, emergency
            vehicles, and commercial traffic."
          </p>
        </div>

        <div class="input-item">
          <h4>Diversion Threshold</h4>
          <p>
            <strong>What it is:</strong> The proportion of traffic reduction
            that represents cancelled trips versus rerouted trips.
          </p>
          <p>
            <strong>Why it matters:</strong> Cancelled trips = maximum
            congestion benefit; Rerouted trips = less congestion but economic
            activity preserved.
          </p>
          <p class="meeting-point">
            <strong>Meeting talking point:</strong> "We model both effects—this
            matters for understanding secondary impacts on surrounding roads."
          </p>
        </div>

        <div class="input-item">
          <h4>Income Distribution Assumptions</h4>
          <p>
            <strong>What it is:</strong> The assumed breakdown of travelers by
            income bracket.
          </p>
          <p>
            <strong>Why it matters:</strong> Congestion pricing affects
            different income groups differently.
          </p>
          <p class="meeting-point">
            <strong>Meeting talking point:</strong> "We model equity impacts by
            income bracket—crucial for designing exemption or discount
            programs."
          </p>
        </div>
      </section>

      <!-- Section 3: Assumptions -->
      <section class="content-section">
        <h3>3. Assumptions</h3>

        <h4>Behavioral Assumptions</h4>
        <ol>
          <li>
            <strong>Rational Economic Actors:</strong> Drivers respond to price
            signals by maximizing personal utility
          </li>
          <li>
            <strong>Price Awareness:</strong> Drivers know the pricing rules
          </li>
          <li>
            <strong>Alternative Availability:</strong> Alternatives exist
            (Metro, carpool, different routes)
          </li>
          <li>
            <strong>Habit vs. Price Trade-off:</strong> Long-term behavioral
            change takes 3-6 months
          </li>
        </ol>

        <div class="meeting-tip">
          <strong>How to say this in a meeting:</strong>
          <blockquote>
            "We assume drivers respond to pricing as rational economic
            actors—this is the standard assumption in transport economics and
            matches observed behavior in implemented systems globally."
          </blockquote>
        </div>

        <h4>What "Elasticity of Demand" Means</h4>

        <div class="technical-box">
          <h5>Technical Definition</h5>
          <p>
            <strong>Price elasticity of demand</strong> measures the percentage
            change in quantity demanded resulting from a 1% change in price.
          </p>
          <pre class="formula">
Elasticity = (% Change in Traffic) / (% Change in Price)

• Elasticity > 1: "Elastic"—small price changes cause large traffic reductions
• Elasticity = 1: "Unit elastic"—proportional changes  
• Elasticity < 1: "Inelastic"—price changes have minimal effect</pre
          >
        </div>

        <div class="plain-box">
          <h5>Plain Language</h5>
          <p>Think of elasticity as <strong>"sensitivity"</strong>:</p>
          <ul>
            <li>
              <strong>High elasticity</strong> = People are very sensitive to
              price. Raise price 10%, see 20% fewer trips.
            </li>
            <li>
              <strong>Low elasticity</strong> = People don't care about price.
              Raise price 10%, see only 2% fewer trips.
            </li>
          </ul>
          <p>For congestion pricing:</p>
          <ul>
            <li>
              <strong>Commute trips</strong>: Moderate elasticity (~0.8-1.2)
            </li>
            <li>
              <strong>Discretionary trips</strong>: High elasticity (~1.5-2.0)
            </li>
            <li>
              <strong>Essential trips</strong>: Very low elasticity (~0.1-0.3)
            </li>
          </ul>
        </div>

        <h4>Risks in Using Simplified Heuristics</h4>
        <ul>
          <li>
            <strong>No Network Modeling</strong> — We don't simulate actual road
            network effects
          </li>
          <li>
            <strong>Static Assumptions</strong> — We assume behavior doesn't
            change over time
          </li>
          <li>
            <strong>No Supply Response</strong> — We don't model road expansion
            or new developments
          </li>
          <li>
            <strong>Homogeneous Groups</strong> — Income brackets are simplified
          </li>
          <li>
            <strong>No Enforcement Modeling</strong> — We assume 100% compliance
          </li>
          <li>
            <strong>Benchmark Transfer</strong> — Using London/Singapore data
            assumes UAE is comparable
          </li>
        </ul>

        <div class="meeting-tip">
          <strong>How to say this in a meeting:</strong>
          <blockquote>
            "This is a heuristic decision-support tool, not a calibrated
            transport model. We use international benchmarks and UAE-specific
            adjustments, but the outputs are directional estimates for
            comparison purposes, not forecasts."
          </blockquote>
        </div>
      </section>

      <!-- Section 4: Multipliers -->
      <section class="content-section">
        <h3>4. Multipliers & Behavioral Modeling</h3>

        <h4>Peak Hour Multiplier Logic</h4>
        <div class="two-column">
          <div class="column">
            <h5>Technical</h5>
            <pre class="code">
// Peak hours: 7-9 AM, 5-8 PM
const isPeakHour = (hour) => 
  (hour >= 7 && hour <= 9) || 
  (hour >= 17 && hour <= 20);

// Multiplier application
baseElasticity = 1.0;
peakMultiplier = 1.4;
effectiveElasticity = baseElasticity × peakMultiplier;</pre
            >
          </div>
          <div class="column">
            <h5>Plain Language</h5>
            <p>
              During rush hour, if you charge AED 10, people think: "Can I take
              the Metro? Can I leave earlier? Can I work from home?"
            </p>
            <p>At 2 AM: "I need to go to the hospital"—price doesn't matter.</p>
          </div>
        </div>

        <h4>Holiday/Prayer Window Adjustments</h4>
        <ul>
          <li>
            <strong>Prayer times</strong>: 30% traffic reduction during prayer
          </li>
          <li>
            <strong>UAE holidays</strong>: 50-80% reduction on National Day
          </li>
          <li><strong>Ramadan</strong>: Entirely different traffic patterns</li>
        </ul>

        <div class="meeting-tip">
          <strong>How to say this in a meeting:</strong>
          <blockquote>
            "The system includes UAE-specific adjustments for prayer times,
            Ramadan, and national holidays—these are significant factors that
            affect traffic patterns."
          </blockquote>
        </div>

        <h4>Salik Behavioral Proxy</h4>
        <p>
          Salik is Dubai's road toll system (AED 4-6). It provides
          <strong>local behavioral evidence</strong>—actual observed driver
          response to road pricing in the UAE context.
        </p>
        <pre class="formula">
Salik observed elasticity: ~8-15% traffic reduction at AED 4-6
salikBaseElasticity = 0.12;
salikProxy = salikBaseElasticity × (congestionPrice / salikAveragePrice);</pre
        >
      </section>

      <!-- Section 5: Diversion Logic -->
      <section class="content-section">
        <h3>5. Diversion Logic</h3>

        <h4>What Diversion Means</h4>
        <div class="two-column">
          <div class="column">
            <h5>Technical</h5>
            <p>
              <strong>Diversion</strong> is the proportion of affected traffic
              that:
            </p>
            <ul>
              <li><strong>Cancels trip</strong> — eliminated demand</li>
              <li><strong>Reroutes</strong> — uses alternative roads</li>
              <li>
                <strong>Switches mode</strong> — takes Metro, bus, carpool
              </li>
              <li>
                <strong>Reschedules</strong> — trips at different free hours
              </li>
            </ul>
          </div>
          <div class="column">
            <h5>Plain Language</h5>
            <p>When you charge people, they choose:</p>
            <ul>
              <li>"I'll just not go" (cancel)</li>
              <li>"I'll take the Metro" (mode switch)</li>
              <li>"I'll use the back roads" (reroute)</li>
              <li>"I'll go after 10 AM" (reschedule)</li>
            </ul>
          </div>
        </div>

        <h4>Our Heuristic Model</h4>
        <ul>
          <li><strong>40-50%</strong> of reduced traffic cancels entirely</li>
          <li><strong>25-35%</strong> switches to alternative transport</li>
          <li><strong>15-25%</strong> reroutes to avoid charges</li>
          <li><strong>5-10%</strong> reschedules to free hours</li>
        </ul>

        <div class="meeting-tip">
          <strong>How to say this in a meeting:</strong>
          <blockquote>
            "We model the 'destination' of reduced traffic—whether drivers
            cancel trips entirely or find alternatives. Our default uses
            international benchmarks but can be adjusted."
          </blockquote>
        </div>
      </section>

      <!-- Section 6: Output Metrics -->
      <section class="content-section">
        <h3>6. Output Metrics</h3>

        <div class="metric-box">
          <h4>% Congestion Reduction</h4>
          <div class="technical-box">
            <pre class="formula">
Congestion Reduction % = 
  (Baseline Traffic - Final Traffic) / Baseline Traffic × 100</pre
            >
          </div>
          <p><strong>Example calculation:</strong></p>
          <ol>
            <li>Start: 100,000 vehicles/day</li>
            <li>Remove exemptions (10%): 90,000 affected</li>
            <li>Apply elasticity (AED 15 × 1.0): -20% = 72,000</li>
            <li>Apply peak multiplier: -5% more = 68,400</li>
            <li><strong>Final: 27.7% reduction</strong></li>
          </ol>
          <div class="meeting-tip">
            <strong>Meeting talking point:</strong>
            <blockquote>
              "A 25-30% reduction is consistent with international
              implementations like Singapore and Stockholm."
            </blockquote>
          </div>
        </div>

        <div class="metric-box">
          <h4>Revenue (Daily, Annual, 5-Year NPV)</h4>
          <ul>
            <li>
              <strong>Daily:</strong> Affected Volume × Average Price ×
              Compliance Rate
            </li>
            <li>
              <strong>Annual:</strong> Daily × 365 × Seasonal Factor (~340 net
              days)
            </li>
            <li><strong>5-Year NPV:</strong> Uses 7% discount rate</li>
          </ul>
          <table class="npv-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Revenue</th>
                <th>NPV Factor (7%)</th>
                <th>NPV</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>375M</td>
                <td>0.935</td>
                <td>351M</td>
              </tr>
              <tr>
                <td>2</td>
                <td>390M</td>
                <td>0.873</td>
                <td>340M</td>
              </tr>
              <tr>
                <td>3</td>
                <td>405M</td>
                <td>0.816</td>
                <td>330M</td>
              </tr>
              <tr>
                <td>4</td>
                <td>420M</td>
                <td>0.763</td>
                <td>320M</td>
              </tr>
              <tr>
                <td>5</td>
                <td>435M</td>
                <td>0.713</td>
                <td>310M</td>
              </tr>
              <tr class="total">
                <td colspan="3">Total</td>
                <td>1,651M</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="metric-box">
          <h4>CO₂ Reduction</h4>
          <pre class="formula">
CO₂ Reduction = Reduced Vehicle-Km × Emission Factor

Example:
• Vehicles reduced: 27,700/day
• Average trip: 8 km
• Vehicle-km eliminated: 221,600 km/day
• CO₂ per km: 0.2 kg
• Daily CO₂ reduction: 44 tonnes
• Annual: ~15,000 tonnes (≈600,000 trees)</pre
          >
        </div>

        <div class="metric-box">
          <h4>Equity Impact</h4>
          <p>
            Compare income bracket share of traffic vs. share of pricing burden:
          </p>
          <table class="equity-table">
            <thead>
              <tr>
                <th>Income</th>
                <th>% Traffic</th>
                <th>% Burden</th>
                <th>Ratio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Low</td>
                <td>20%</td>
                <td>25%</td>
                <td>1.25 (disproportionate)</td>
              </tr>
              <tr>
                <td>Middle</td>
                <td>50%</td>
                <td>45%</td>
                <td>0.90 (fair)</td>
              </tr>
              <tr>
                <td>High</td>
                <td>30%</td>
                <td>30%</td>
                <td>1.00 (fair)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="metric-box">
          <h4>ROI & Payback Period</h4>
          <pre class="formula">
ROI = (Net Benefits - Implementation Cost) / Implementation Cost × 100%
Payback Period = Implementation Cost / Annual Net Benefit

Example:
• Implementation cost: AED 50 million
• Annual net benefit: AED 350 million
• Payback: 0.14 years (~7 weeks)</pre
          >
        </div>
      </section>

      <!-- Section 7: Limitations -->
      <section class="content-section">
        <h3>7. Limitations</h3>

        <h4>Why This Is Not a Calibrated Transport Model</h4>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Our System</th>
              <th>Professional Model</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Network modeling</td>
              <td>Heuristic estimates</td>
              <td>Full simulation</td>
            </tr>
            <tr>
              <td>Origin-destination</td>
              <td>Aggregated volumes</td>
              <td>Detailed OD matrices</td>
            </tr>
            <tr>
              <td>Calibration</td>
              <td>Benchmark-based</td>
              <td>Local data calibrated</td>
            </tr>
            <tr>
              <td>Time resolution</td>
              <td>Hourly</td>
              <td>Minute-by-minute</td>
            </tr>
          </tbody>
        </table>

        <h4>What Would Be Required for Official Validation</h4>
        <ul>
          <li>
            <strong>Data collection:</strong> 6-12 months, traffic counts, OD
            surveys
          </li>
          <li>
            <strong>Calibration:</strong> 3-6 months, adjust to local data
          </li>
          <li>
            <strong>Peer review:</strong> 3-6 months, independent validation
          </li>
          <li><strong>Total:</strong> 12-24 months, AED 5-20 million</li>
        </ul>

        <div class="meeting-tip warning">
          <strong>How to say this in a meeting:</strong>
          <blockquote>
            "Full model calibration would require extensive local data
            collection and validation—this is a significant undertaking that
            would follow policy approval, not precede it. Our tool provides
            directional estimates to inform the decision to pursue a pilot."
          </blockquote>
        </div>

        <h4>Uncertainty Ranges</h4>
        <ul>
          <li><strong>Elasticity Assumptions:</strong> ±30%</li>
          <li><strong>Diversion Split:</strong> ±20%</li>
          <li><strong>Compliance Rate:</strong> ±10%</li>
          <li><strong>Behavioral Adaptation:</strong> Unknown</li>
        </ul>
      </section>

      <!-- Section 8: Institutional Framing -->
      <section class="content-section">
        <h3>8. Institutional Framing</h3>

        <h4>How to Professionally Describe This System</h4>

        <div class="framing-box">
          <h5>A "Pre-Pilot Decision-Support Tool"</h5>
          <p>
            <strong>What it IS:</strong> A structured analytical tool that helps
            policymakers understand potential impacts before committing to a
            full pilot.
          </p>
          <p>
            <strong>What it is NOT:</strong> An enforcement system, a
            forecasting engine, or a policy decision maker.
          </p>
        </div>

        <div class="meeting-tip">
          <strong>The 30-Second Pitch:</strong>
          <blockquote>
            "Smart Mobility Simulator is a decision-support tool that helps UAE
            transport authorities analyze congestion pricing scenarios before
            committing to a pilot. It models different pricing configurations,
            estimates revenue and congestion impacts, and generates professional
            reports for stakeholder engagement. It's not a calibrated model or
            enforcement system—it's a structured comparison platform to inform
            policy decisions."
          </blockquote>
        </div>

        <div class="framing-box">
          <h5>Key Messages to Remember</h5>
          <ol>
            <li>
              ✅ <strong>Pre-pilot tool</strong> — not post-implementation
            </li>
            <li>
              ✅ <strong>International benchmarks</strong> — adapted for UAE
            </li>
            <li>
              ✅ <strong>Scenario comparison</strong> — not crystal-ball
              forecasting
            </li>
            <li>
              ✅ <strong>Heuristic model</strong> — not calibrated transport
              model
            </li>
            <li>
              ✅ <strong>Decision support</strong> — not policy enforcement
            </li>
            <li>
              ✅ <strong>Professional reports</strong> — stakeholder-ready
              outputs
            </li>
          </ol>
        </div>

        <div class="meeting-tip">
          <strong>The 2-Minute Explanation:</strong>
          <blockquote>
            "This system uses established international benchmarks from
            Singapore, London, Stockholm, and Milan, adapted for UAE context
            including prayer times, Ramadan, and Salik behavioral data. It
            calculates congestion reduction based on price elasticity
            principles, applies time-of-day multipliers, and estimates revenue,
            equity, and environmental impacts. The outputs are directional
            estimates for comparison purposes—not precise forecasts. It's
            designed to help policymakers understand trade-offs between
            different pricing configurations before investing in full pilot
            implementation."
          </blockquote>
        </div>
      </section>

      <!-- Footer -->
      <div class="footer">
        <p><strong>Smart Mobility Simulator</strong> — Technical Guide</p>
        <p>Document Version 1.0 | February 2026</p>
      </div>
    </div>
  `,
  styles: [
    `
      .technical-guide-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
      }

      .header {
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 3px solid #0d47a1;
      }

      .header h1 {
        font-size: 2.5em;
        color: #0d47a1;
        margin-bottom: 10px;
      }

      .header h2 {
        font-size: 1.5em;
        color: #666;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .date {
        color: #999;
        font-size: 0.9em;
      }

      .content-section {
        margin-bottom: 50px;
      }

      .content-section h3 {
        font-size: 1.8em;
        color: #0d47a1;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #e0e0e0;
      }

      .content-section h4 {
        font-size: 1.3em;
        color: #333;
        margin-top: 25px;
        margin-bottom: 15px;
      }

      .technical-box,
      .plain-box {
        padding: 20px;
        border-radius: 8px;
        margin: 15px 0;
      }

      .technical-box {
        background: #f5f5f5;
        border-left: 4px solid #0d47a1;
      }

      .plain-box {
        background: #fffde7;
        border-left: 4px solid #f59e0b;
      }

      .technical-box h5,
      .plain-box h5 {
        margin: 0 0 10px 0;
        font-size: 1.1em;
      }

      .formula {
        background: #263238;
        color: #aed581;
        padding: 15px;
        border-radius: 5px;
        overflow-x: auto;
        font-family: "Consolas", monospace;
        font-size: 0.9em;
      }

      .code {
        background: #263238;
        color: #80cbc4;
        padding: 15px;
        border-radius: 5px;
        overflow-x: auto;
        font-family: "Consolas", monospace;
        font-size: 0.85em;
      }

      .two-column {
        display: flex;
        gap: 30px;
        margin: 20px 0;
      }

      .two-column .column {
        flex: 1;
      }

      .meeting-tip {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        padding: 15px 20px;
        margin: 20px 0;
        border-radius: 0 8px 8px 0;
      }

      .meeting-tip.warning {
        background: #fff3e0;
        border-left-color: #ff9800;
      }

      .meeting-tip strong {
        display: block;
        margin-bottom: 10px;
        color: #1565c0;
      }

      .meeting-tip blockquote {
        margin: 0;
        font-style: italic;
        color: #555;
      }

      .input-item {
        background: #fafafa;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
        border-left: 3px solid #0d47a1;
      }

      .input-item h4 {
        margin-top: 0;
        color: #0d47a1;
      }

      .meeting-point {
        background: #e8f5e9;
        padding: 10px 15px;
        border-radius: 5px;
        margin-top: 10px;
      }

      .metric-box {
        background: #fafafa;
        padding: 20px;
        margin-bottom: 25px;
        border-radius: 8px;
      }

      .metric-box h4 {
        color: #0d47a1;
        margin-top: 0;
      }

      .npv-table,
      .equity-table,
      .comparison-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
      }

      .npv-table th,
      .npv-table td,
      .equity-table th,
      .equity-table td,
      .comparison-table th,
      .comparison-table td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      .npv-table th,
      .equity-table th,
      .comparison-table th {
        background: #0d47a1;
        color: white;
      }

      .npv-table .total {
        background: #e3f2fd;
        font-weight: bold;
      }

      .framing-box {
        background: #e8eaf6;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      }

      .framing-box h5 {
        color: #0d47a1;
        margin-top: 0;
      }

      .footer {
        text-align: center;
        margin-top: 50px;
        padding-top: 20px;
        border-top: 2px solid #e0e0e0;
        color: #666;
      }

      @media print {
        .technical-guide-container {
          padding: 20px;
        }

        .content-section {
          page-break-inside: avoid;
        }
      }
    `,
  ],
})
export class TechnicalGuideComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}



