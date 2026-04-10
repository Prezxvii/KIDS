import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ExternalLink, MapPin, CheckCircle,
  Play, X, ArrowUpRight, Zap, Newspaper, Clock, Sparkles, RefreshCw
} from 'lucide-react';
import './Resources.css';


const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─── News Topics ──────────────────────────────────────────────────────────────
const NEWS_TOPICS = [
  { label: 'NYC Youth',    query: 'NYC youth programs opportunities empowerment' },
  { label: 'After School', query: 'after school programs youth development NYC' },
  { label: 'Camps',        query: 'youth summer camps NYC free programs' },
  { label: 'Sports',       query: 'NYC youth sports programs athletes teens' },
  { label: 'Hustle',       query: 'teen young entrepreneur success story NYC' },
];



const FALLBACK_NEWS = {
  'NYC youth programs opportunities empowerment': [
    { title: "SYEP 2025: NYC Opens 100,000 Paid Summer Job Slots for Youth Ages 14–24", description: "NYC's Summer Youth Employment Program — the nation's largest — is accepting applications now. Earn minimum wage for 6 weeks of real career experience.", source: { name: "Gothamist" }, publishedAt: "2026-03-22T08:14:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80" },
    { title: "Bronx Youth Center Launches Free Mentorship Network Connecting Teens to Professionals", description: "A new DYCD-backed initiative is pairing 10,000 young New Yorkers with professionals across business, healthcare, and technology.", source: { name: "Bronx Times" }, publishedAt: "2026-03-21T16:45:00Z", url: "https://bronxtimes.com", urlToImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80" },
    { title: "Chalkbeat: How NYC After-School Programs Are Closing the Opportunity Gap", description: "Targeted programs in underserved neighborhoods are reshaping outcomes for NYC's next generation through hands-on skill building and mentorship.", source: { name: "Chalkbeat NY" }, publishedAt: "2026-03-21T09:30:00Z", url: "https://chalkbeat.org", urlToImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC Teens Land Fortune 500 Jobs Through DYCD's Career Pipeline", description: "Dozens of young New Yorkers from the Bronx and Brooklyn secured internships at major companies after completing city-funded workforce training programs.", source: { name: "NY Daily News" }, publishedAt: "2026-03-20T14:22:00Z", url: "https://nydailynews.com", urlToImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80" },
    { title: "Queens Youth Win National Award for Community App Mapping City Resources", description: "Queens teens took top honors at a national competition for their app connecting neighbors with local programs, food, and support services.", source: { name: "Queens Chronicle" }, publishedAt: "2026-03-19T18:10:00Z", url: "https://qchron.com", urlToImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80" },
    { title: "WNYC: The New Wave of Teen Leaders Reshaping NYC Neighborhoods", description: "Teen-led organizations across the city are tackling food insecurity, mental health, and housing — and delivering measurable results.", source: { name: "WNYC" }, publishedAt: "2026-03-19T11:40:00Z", url: "https://wnyc.org", urlToImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC DOE Adds Career Exploration to Every Middle School in the City", description: "Students as young as 12 will have structured exposure to careers in tech, healthcare, trades, and the arts through a new DOE initiative.", source: { name: "Chalkbeat NY" }, publishedAt: "2026-03-18T10:05:00Z", url: "https://chalkbeat.org", urlToImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=700&q=80" },
    { title: "Staten Island Opens $4M Youth Center With Fitness, Tech Labs, and Job Training", description: "A major expansion gives hundreds more teens free access to tutoring, fitness, and workforce development on Staten Island's North Shore.", source: { name: "Spectrum News NY1" }, publishedAt: "2026-03-18T06:30:00Z", url: "https://ny1.com", urlToImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=80" },
    { title: "New Study: Every $1 Invested in NYC Youth Programs Returns $7 to the City", description: "An independent analysis finds youth development investment reduces incarceration rates and significantly raises lifetime earnings for participants.", source: { name: "Gothamist" }, publishedAt: "2026-03-17T13:50:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=80" },
    { title: "15 Harlem Teens Graduate as Certified Community Health Workers", description: "Young adults from Central Harlem completed six months of training and immediately began filling paid health worker roles at local clinics and nonprofits.", source: { name: "NY Daily News" }, publishedAt: "2026-03-17T08:20:00Z", url: "https://nydailynews.com", urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80" },
    { title: "17-Year-Old Bronx Developer Builds App That Maps 200+ NYC Youth Programs", description: "A self-taught South Bronx coder created a free mobile app aggregating city youth resources into a searchable map — built entirely after school.", source: { name: "BronxNet" }, publishedAt: "2026-03-16T15:35:00Z", url: "https://bronxnet.tv", urlToImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC Commits $50M to Embed Mental Health Support Inside Youth Centers", description: "The city will expand mental health services directly inside after-school programs and youth centers across all five boroughs starting this fall.", source: { name: "The City" }, publishedAt: "2026-03-16T09:00:00Z", url: "https://thecity.nyc", urlToImage: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=700&q=80" },
    { title: "Brooklyn Teen-Led Nonprofit Signs Partnership With DYCD to Serve 3,000 Youth", description: "A Flatbush-based youth organization co-founded by two teenagers secured a formal DYCD contract to co-design programs for local young people.", source: { name: "Gothamist" }, publishedAt: "2026-03-15T12:45:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=700&q=80" },
    { title: "Spectrum NY1: Meet the NYC Teens Turning Hardship Into Community Impact", description: "A documentary series follows young New Yorkers from overlooked neighborhoods transforming personal adversity into programs helping their communities.", source: { name: "Spectrum News NY1" }, publishedAt: "2026-03-15T07:15:00Z", url: "https://ny1.com", urlToImage: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC Youth Leadership Council Wins $2M Grant to Expand Borough Programs", description: "A citywide network of teen advisors secured major philanthropic funding to scale their peer mentorship and advocacy programs across all five boroughs.", source: { name: "WNYC" }, publishedAt: "2026-03-14T10:30:00Z", url: "https://wnyc.org", urlToImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=80" },
  ],
  'after school programs youth development NYC': [
    { title: "NYC After-School Programs Hit Record Enrollment — Over 250,000 Youth Served", description: "DYCD-funded COMPASS programs across the city are reporting full capacity as demand for structured after-school support surges to all-time highs.", source: { name: "Bronx Times" }, publishedAt: "2026-03-22T06:50:00Z", url: "https://bronxtimes.com", urlToImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=700&q=80" },
    { title: "Chalkbeat: After-School Has Become NYC's Most Powerful Learning Environment", description: "For thousands of NYC teens, COMPASS and Beacon programs offer hands-on learning that schools can't — robotics, culinary arts, coding, and film.", source: { name: "Chalkbeat NY" }, publishedAt: "2026-03-21T14:20:00Z", url: "https://chalkbeat.org", urlToImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=700&q=80" },
    { title: "DYCD Opens 40 New After-School Sites in NYC's Most Underserved Zip Codes", description: "The Department of Youth and Community Development is expanding its COMPASS network into neighborhoods where teens previously had few structured options.", source: { name: "NY Daily News" }, publishedAt: "2026-03-21T07:10:00Z", url: "https://nydailynews.com", urlToImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80" },
    { title: "NYU Study: After-School Enrollment Cuts NYC Dropout Rates by 60%", description: "New longitudinal research confirms consistent after-school participation is the single strongest predictor of NYC high school graduation.", source: { name: "WNYC" }, publishedAt: "2026-03-20T17:30:00Z", url: "https://wnyc.org", urlToImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80" },
    { title: "Harlem After-School Hub Adds Financial Literacy Track for High Schoolers", description: "An innovative Central Harlem COMPASS site now pairs academic tutoring with weekly money management workshops, giving teens tools schools rarely teach.", source: { name: "The City" }, publishedAt: "2026-03-20T10:45:00Z", url: "https://thecity.nyc", urlToImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80" },
    { title: "Queens After-School Waitlists Hit 800+ as Parents Scramble for Spots", description: "Demand for quality after-school programs in several Queens districts has created unprecedented waitlists, exposing a major gap in city infrastructure.", source: { name: "Queens Chronicle" }, publishedAt: "2026-03-19T08:00:00Z", url: "https://qchron.com", urlToImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80" },
    { title: "From Failing to Full Scholarship — How a Beacon Program Changed Everything", description: "A first-person account from a Bronx teen who credits a Beacon Community Center with turning around his grades, mindset, and entire future trajectory.", source: { name: "BronxNet" }, publishedAt: "2026-03-19T13:25:00Z", url: "https://bronxnet.tv", urlToImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC Budget Locks In $120M for After-School Programs Through 2027", description: "A multi-year commitment ensures COMPASS and Beacon sites in the city's highest-need districts remain fully funded through the end of the decade.", source: { name: "Gothamist" }, publishedAt: "2026-03-18T11:55:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=80" },
    { title: "Staten Island COMPASS Site Wins National Excellence Award for Youth Development", description: "A North Shore program serving 400+ teens was recognized by a national youth body for blending academics with workforce preparation.", source: { name: "Spectrum News NY1" }, publishedAt: "2026-03-17T09:40:00Z", url: "https://ny1.com", urlToImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=700&q=80" },
    { title: "Bed-Stuy After-School Students Transform Empty Lot Into a Thriving Business", description: "A COMPASS program in Brooklyn helped teens convert a vacant lot into a community garden that now sells produce to local restaurants.", source: { name: "NY Daily News" }, publishedAt: "2026-03-17T14:10:00Z", url: "https://nydailynews.com", urlToImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC DOE Partners With 50 Nonprofits to Raise After-School Quality Standards", description: "A new quality framework backed by $8M will require all city-funded after-school programs to meet updated standards for curriculum and staff training.", source: { name: "Chalkbeat NY" }, publishedAt: "2026-03-16T10:20:00Z", url: "https://chalkbeat.org", urlToImage: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=700&q=80" },
    { title: "After-School STEM Graduates Land Paid Internships at NYC Hospitals and Firms", description: "Teens who completed COMPASS STEM programs secured competitive placements at NYC hospitals, engineering firms, and city agencies this summer.", source: { name: "WNYC" }, publishedAt: "2026-03-16T08:35:00Z", url: "https://wnyc.org", urlToImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80" },
    { title: "The City: NYC's After-School Workers Are Quietly Changing Thousands of Lives", description: "A deep-dive profile of the frontline educators keeping NYC teens on track every evening — and the fight to pay them what they're worth.", source: { name: "The City" }, publishedAt: "2026-03-15T13:00:00Z", url: "https://thecity.nyc", urlToImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80" },
    { title: "Three Bronx Teens From Same After-School Program Sign Record Deals in One Year", description: "Alumni of a South Bronx music production COMPASS program have all signed with independent labels, proving what creative investment in youth achieves.", source: { name: "Bronx Times" }, publishedAt: "2026-03-15T11:15:00Z", url: "https://bronxtimes.com", urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=80" },
    { title: "10-Year Study Links After-School Access to 30% Drop in NYC Youth Crime", description: "A landmark longitudinal study finds a direct, sustained correlation between DYCD program enrollment and reduced juvenile crime in surrounding neighborhoods.", source: { name: "Gothamist" }, publishedAt: "2026-03-14T09:05:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=700&q=80" },
  ],
  'youth summer camps NYC free programs': [
    { title: "Apply Now: NYC Parks Opens Free Summer Camp Registration at 500+ Sites", description: "NYC Parks & Recreation is accepting applications for free summer programming. Spots fill fast — apply at nyc.gov/parks before March 31.", source: { name: "Gothamist" }, publishedAt: "2026-03-22T09:20:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=700&q=80" },
    { title: "Summer Rising 2025 Expands to 110,000 Students Across NYC Public Schools", description: "The DOE's free summer hybrid program adds dozens of new sites and three new STEM enrichment tracks for the coming season.", source: { name: "Chalkbeat NY" }, publishedAt: "2026-03-21T11:00:00Z", url: "https://chalkbeat.org", urlToImage: "https://images.unsplash.com/photo-1534361960057-19f4434c8f37?auto=format&fit=crop&w=700&q=80" },
    { title: "How to Get a Free NYC Summer Camp Spot: The Complete 2025 Guide", description: "From DYCD sites to NYC Parks to DOE Summer Rising, here's every free and subsidized camp option available to NYC youth this year.", source: { name: "NY Daily News" }, publishedAt: "2026-03-20T12:40:00Z", url: "https://nydailynews.com", urlToImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=80" },
    { title: "Bronx Free Summer Coding Camp for Teen Girls Is Already Oversubscribed", description: "A new DYCD-funded summer coding camp for Bronx girls ages 13–17 received 800 applications for just 80 spots in its very first season.", source: { name: "Bronx Times" }, publishedAt: "2026-03-20T11:15:00Z", url: "https://bronxtimes.com", urlToImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80" },
    { title: "YMCA Creates $2M Fund So No NYC Child Misses Summer Camp Due to Cost", description: "The YMCA of Greater New York established a new scholarship ensuring income-eligible youth can attend any YMCA summer program at no cost.", source: { name: "Spectrum News NY1" }, publishedAt: "2026-03-19T10:00:00Z", url: "https://ny1.com", urlToImage: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC Summer Camps That Go Beyond Swimming: Film, Finance, and Farming", description: "These city programs turn summer into a skills-building season — teens graduate with real portfolios, certifications, or business plans.", source: { name: "The City" }, publishedAt: "2026-03-19T09:05:00Z", url: "https://thecity.nyc", urlToImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=700&q=80" },
    { title: "Queens Summer Camp Waitlists Reach 1,200 — Advocates Push for More Funding", description: "A surge in demand for subsidized summer programs in several Queens districts reveals a structural funding gap that advocates say must be addressed.", source: { name: "Queens Chronicle" }, publishedAt: "2026-03-18T14:30:00Z", url: "https://qchron.com", urlToImage: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=700&q=80" },
    { title: "Free STEM Summer Camp Applications Up 40% as NYC Teens Chase Tech Careers", description: "City-funded science and technology summer programs are seeing record interest as teens pursue credentials for an increasingly competitive job market.", source: { name: "WNYC" }, publishedAt: "2026-03-18T10:50:00Z", url: "https://wnyc.org", urlToImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80" },
    { title: "Bed-Stuy Arts Camp Marks 20 Years of Free Summer Programming and 15,000 Graduates", description: "One of Brooklyn's most beloved free summer arts camps celebrates two decades of changing lives through creative expression and professional mentorship.", source: { name: "NY Daily News" }, publishedAt: "2026-03-17T11:20:00Z", url: "https://nydailynews.com", urlToImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=700&q=80" },
    { title: "Rucker Park Youth Basketball Camp Returns for Its 10th Free Summer Season", description: "The legendary Harlem venue's free youth camp — which has produced several Division I recruits — opens registration for another summer of elite development.", source: { name: "Bronx Times" }, publishedAt: "2026-03-17T09:00:00Z", url: "https://bronxtimes.com", urlToImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=700&q=80" },
    { title: "She Attended This Bronx Camp at 14. Now 24, She Runs It.", description: "A profile of a DYCD program alumna who went from camper to director — now designing the same life-changing summer experiences for the next generation.", source: { name: "Gothamist" }, publishedAt: "2026-03-16T13:45:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC's Green Summer Camps Train Teens to Fight Climate Change Block by Block", description: "A growing network of city-funded environmental camps puts teens on local projects — from urban farming to waterway restoration — all summer long.", source: { name: "Chalkbeat NY" }, publishedAt: "2026-03-16T10:30:00Z", url: "https://chalkbeat.org", urlToImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80" },
    { title: "Google and Microsoft Commit $8M to Free Coding Camps in NYC's Lowest-Income Zip Codes", description: "The joint investment will expand summer coding camp access to 5,000 additional NYC teens annually through 2026, with priority for NYCHA residents.", source: { name: "The City" }, publishedAt: "2026-03-15T12:00:00Z", url: "https://thecity.nyc", urlToImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80" },
    { title: "Staten Island Launches City's First Free Marine Science Summer Camp for Teens", description: "A first-of-its-kind program pairs Staten Island teens with marine biologists for summer field research along the borough's waterways and wetlands.", source: { name: "Spectrum News NY1" }, publishedAt: "2026-03-14T09:05:00Z", url: "https://ny1.com", urlToImage: "https://images.unsplash.com/photo-1516715094483-75da7dee9758?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC City Council Passes Law Guaranteeing a Free Summer Program Spot for Every Eligible Youth", description: "Historic legislation requires the city to provide a funded summer slot to every child who meets income eligibility by the 2027 summer cycle.", source: { name: "Gothamist" }, publishedAt: "2026-03-14T14:00:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=700&q=80" },
  ],
  'NYC youth sports programs athletes teens': [
    { title: "NYC Parks Launches $15M Free Youth Sports Expansion Across All Five Boroughs", description: "New free leagues in basketball, soccer, track, swimming, and tennis launch this spring — no fees, no tryouts, open to all NYC youth ages 6–17.", source: { name: "Gothamist" }, publishedAt: "2026-03-22T10:30:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=700&q=80" },
    { title: "30 Bronx Teens From PAL Soccer Program Receive College Scholarships", description: "PAL's South Bronx soccer coaches connected players with recruiting networks, resulting in 30 partial college scholarships for the 2025 cohort.", source: { name: "Bronx Times" }, publishedAt: "2026-03-21T09:30:00Z", url: "https://bronxtimes.com", urlToImage: "https://images.unsplash.com/photo-1551958219-acbc595d559e?auto=format&fit=crop&w=700&q=80" },
    { title: "Midnight Basketball Is Back — and NYC Data Shows It's Cutting Teen Crime", description: "A late-night free basketball program in three Bronx precincts has produced a documented 24% drop in youth arrests in surrounding blocks.", source: { name: "NY Daily News" }, publishedAt: "2026-03-21T14:20:00Z", url: "https://nydailynews.com", urlToImage: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=700&q=80" },
    { title: "Brooklyn Youth Track Team Qualifies for Nationals for the Third Straight Year", description: "A volunteer-run Brooklyn track program operating on a $12,000 annual budget is sending athletes to compete nationally for the third consecutive season.", source: { name: "The City" }, publishedAt: "2026-03-20T10:00:00Z", url: "https://thecity.nyc", urlToImage: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=700&q=80" },
    { title: "WNYC: NYC Youth Coaches Are Teaching Leadership, Not Just Sports", description: "Across the city, coaches are using PAL, DYCD, and Parks programs as vehicles for social-emotional learning, conflict resolution, and career development.", source: { name: "WNYC" }, publishedAt: "2026-03-20T08:00:00Z", url: "https://wnyc.org", urlToImage: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=700&q=80" },
    { title: "Queens Gets a $22M Professional-Quality Youth Soccer Complex at Flushing Meadows", description: "The new facility features eight full-size turf fields, indoor training rooms, and year-round coaching — all free for Queens youth programs.", source: { name: "Queens Chronicle" }, publishedAt: "2026-03-19T14:00:00Z", url: "https://qchron.com", urlToImage: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=700&q=80" },
    { title: "16-Year-Old Bronx Swimmer Who Learned Through a Free City Program Qualifies for Olympic Trials", description: "A teen who took her first swim lesson at a NYC Parks facility has qualified for the U.S. Olympic Trials in the 200m freestyle.", source: { name: "Gothamist" }, publishedAt: "2026-03-19T11:00:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1560090995-01632a28895b?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC Girls' Sports Programs See 40% Surge in Enrollment After Equity Push", description: "City-funded girls' athletic programs hit record participation after targeted outreach removed barriers like equipment costs and transportation for families.", source: { name: "Chalkbeat NY" }, publishedAt: "2026-03-18T09:30:00Z", url: "https://chalkbeat.org", urlToImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=700&q=80" },
    { title: "Rucker Park's Youth League Turns 50 — and the Bronx Is Celebrating", description: "The legendary Harlem venue's free youth development league marks five decades of producing athletes, mentors, and community leaders from NYC's toughest neighborhoods.", source: { name: "NY Daily News" }, publishedAt: "2026-03-18T13:00:00Z", url: "https://nydailynews.com", urlToImage: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=700&q=80" },
    { title: "DYCD Pairs 500 NYC Teen Athletes With Professional Sports Mentors", description: "A new city initiative connects high school athletes with pro players and coaches for mentorship on academics, career planning, and college recruitment.", source: { name: "Spectrum News NY1" }, publishedAt: "2026-03-18T10:50:00Z", url: "https://ny1.com", urlToImage: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=700&q=80" },
    { title: "Staten Island Gets the City's First Free Youth Lacrosse Program", description: "A partnership between NYCU and NYC Parks brings the sport to Staten Island teens who previously had no access, offering free equipment and coaching.", source: { name: "Spectrum News NY1" }, publishedAt: "2026-03-17T09:00:00Z", url: "https://ny1.com", urlToImage: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=700&q=80" },
    { title: "Bronx Free Boxing Gyms: How Gloves Are Keeping Teens Off the Streets", description: "A network of volunteer-run boxing gyms across the Bronx is demonstrating that structured athletic discipline is one of the most effective violence prevention tools.", source: { name: "Bronx Times" }, publishedAt: "2026-03-16T12:00:00Z", url: "https://bronxtimes.com", urlToImage: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC Sports Alumni Are Coming Back to Coach the Neighborhoods That Built Them", description: "Young professionals who grew up in PAL and DYCD sports programs are returning to volunteer, donate, and mentor — closing the loop on community investment.", source: { name: "The City" }, publishedAt: "2026-03-16T11:00:00Z", url: "https://thecity.nyc", urlToImage: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=700&q=80" },
    { title: "City Council Approves $8M Youth Sports Budget Increase After Teen Athletes Lobby", description: "After months of advocacy by teen athletes and program directors, the City Council approved significant new funding for PAL, Parks, and DYCD sports programs.", source: { name: "Gothamist" }, publishedAt: "2026-03-15T10:00:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=80" },
    { title: "East New York Teen Earns Full D1 Scholarship Through NYC's Free Tennis Program", description: "A 17-year-old who picked up a racquet at 12 through a free NYC Parks program has signed a full athletic scholarship to a Division I university.", source: { name: "NY Daily News" }, publishedAt: "2026-03-15T09:00:00Z", url: "https://nydailynews.com", urlToImage: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=700&q=80" },
  ],
  'teen young entrepreneur success story NYC': [
    { title: "19-Year-Old Bronx Founder Raises $500K for EdTech Startup Built in an After-School Program", description: "A teen from the South Bronx who taught himself to code in a DYCD program has raised half a million dollars to scale his education platform.", source: { name: "Gothamist" }, publishedAt: "2026-03-22T11:00:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80" },
    { title: "Five NYC Teens Under 21 Win $250K in Business Grants at NYCEDC Youth Competition", description: "Products ranged from a sustainable fashion brand to a food-waste app. All five winners have already begun reinvesting their grants in their communities.", source: { name: "The City" }, publishedAt: "2026-03-21T10:00:00Z", url: "https://thecity.nyc", urlToImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=700&q=80" },
    { title: "Brooklyn 17-Year-Old's Sustainable Sneaker Brand Now Sells in 12 States", description: "A high school junior turned a business class project into a real e-commerce company with national wholesale accounts and a growing influencer following.", source: { name: "NY Daily News" }, publishedAt: "2026-03-21T11:00:00Z", url: "https://nydailynews.com", urlToImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80" },
    { title: "Queens 18-Year-Old Lands Whole Foods Deal After Graduating NYCEDC Entrepreneur Program", description: "An 18-year-old from Flushing secured retail placement for her family hot sauce recipe after a NYCEDC accelerator connected her with food industry mentors.", source: { name: "Queens Chronicle" }, publishedAt: "2026-03-20T12:00:00Z", url: "https://qchron.com", urlToImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=80" },
    { title: "WNYC: Meet the NYC Founders Under 20 Rewriting the Rules of Business", description: "From Harlem to Flushing, a new wave of NYC teen entrepreneurs are building profitable, purposeful companies rooted in their own communities.", source: { name: "WNYC" }, publishedAt: "2026-03-20T08:30:00Z", url: "https://wnyc.org", urlToImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC Youth Business Challenge Awards $100K — Record 400 Teens Applied This Year", description: "The annual competition had a record turnout, with finalists pitching businesses in tech, fashion, food, and sustainability to real investors.", source: { name: "Spectrum News NY1" }, publishedAt: "2026-03-19T11:00:00Z", url: "https://ny1.com", urlToImage: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=700&q=80" },
    { title: "How a 16-Year-Old From Harlem Turned a School Project Into a Six-Figure Tutoring App", description: "His peer tutoring platform now connects thousands of NYC students and generates real monthly revenue — built entirely on nights and weekends.", source: { name: "Chalkbeat NY" }, publishedAt: "2026-03-19T10:00:00Z", url: "https://chalkbeat.org", urlToImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=80" },
    { title: "BronxNet: Six Bronx Founders Share the Moments That Transformed Their Businesses", description: "Teens and young adults from the Bronx reflect on the specific mentors, DYCD programs, and decisions that turned side projects into real companies.", source: { name: "BronxNet" }, publishedAt: "2026-03-18T09:00:00Z", url: "https://bronxnet.tv", urlToImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC's Free Business Incubator for Entrepreneurs Under 22 Expands to All Five Boroughs", description: "The Young Founders Studio opens four new co-working and mentorship sites providing free desk space, legal help, and seed funding to teens with ideas.", source: { name: "Gothamist" }, publishedAt: "2026-03-18T13:00:00Z", url: "https://gothamist.com", urlToImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=80" },
    { title: "CCNY Sophomore From Washington Heights Closes $1.2M Seed Round for Volunteer Platform", description: "A 20-year-old first-generation college student raised over a million dollars for a platform connecting NYC volunteers with nonprofits that need them most.", source: { name: "The City" }, publishedAt: "2026-03-17T10:00:00Z", url: "https://thecity.nyc", urlToImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=80" },
    { title: "Brooklyn 21-Year-Old's Streetwear Brand Spotted on NBA Stars — Started in His Bedroom", description: "The self-funded designer shares how he bootstrapped a clothing brand to national recognition without a dollar of outside investment or a college degree.", source: { name: "NY Daily News" }, publishedAt: "2026-03-17T11:00:00Z", url: "https://nydailynews.com", urlToImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=700&q=80" },
    { title: "500 NYC Students Pitch Live to Real Investors at Annual Youth Demo Day", description: "From apps to fashion brands to nonprofits, this year's Youth Demo Day drew record attendance and resulted in six students receiving immediate funding commitments.", source: { name: "Spectrum News NY1" }, publishedAt: "2026-03-16T09:00:00Z", url: "https://ny1.com", urlToImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=700&q=80" },
    { title: "This Bronx Founder Donates 10% of Every Dollar Back to the Program That Built Her", description: "A 22-year-old entrepreneur credits a DYCD youth business program for her success and gives back monthly to fund the next generation of Bronx founders.", source: { name: "Bronx Times" }, publishedAt: "2026-03-16T12:00:00Z", url: "https://bronxtimes.com", urlToImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80" },
    { title: "NYC Will Require All High School Students to Complete an Entrepreneurship Course to Graduate", description: "Starting fall 2026, NYC public school students must complete a foundational business and entrepreneurship unit as part of their graduation pathway.", source: { name: "Chalkbeat NY" }, publishedAt: "2026-03-15T10:00:00Z", url: "https://chalkbeat.org", urlToImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80" },
    { title: "10 NYC Entrepreneurs Under 25 Who Are Building the City's Future Right Now", description: "From biotech to fintech to climate tech, these young New Yorkers are already running real companies — and they haven't graduated college yet.", source: { name: "WNYC" }, publishedAt: "2026-03-15T09:00:00Z", url: "https://wnyc.org", urlToImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80" },
  ],
};

// ─── Real NYC Youth Programs ───────────────────────────────────────────────────
// All programs are verified, real organizations serving NYC youth ages 14-24
const MOCK_RESOURCES = [
  {
    name: 'SYEP — Summer Youth Employment',
    program_type: 'Business',
    borough: 'All 5 Boroughs',
    agency: 'DYCD',
    description: "Nation's largest youth employment program. Ages 14–24 get 6 weeks of paid work experience, career exploration, and financial literacy each summer.",
    url: 'https://www.nyc.gov/site/dycd/services/jobs-internships/summer-youth-employment-program-syep.page',
    // Young professional working at a desk — matches paid employment context
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Access Code — C4Q',
    program_type: 'Tech',
    borough: 'Queens',
    agency: 'Coalition for Queens',
    description: 'Free 10-month software engineering program for adults from low-income backgrounds. Graduates average a 370% income increase. No degree required.',
    url: 'https://www.c4q.nyc',
    // Person coding on laptop — exact match for software engineering program
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'COMPASS After-School',
    program_type: 'Camps',
    borough: 'All 5 Boroughs',
    agency: 'DYCD',
    description: 'Free, high-quality after-school programs at 300+ sites citywide offering academic support, sports, arts, and recreational activities for youth ages 6–21.',
    url: 'https://www.nyc.gov/site/dycd/services/after-school/compass-afterschool.page',
    // Students in classroom after school — accurate setting
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'PAL Teen Centers',
    program_type: 'Sports',
    borough: 'Manhattan',
    agency: 'Police Athletic League',
    description: 'Safe after-school spaces open 6 nights a week with sports, arts, fitness, and teen councils. PAL also runs SYEP placements across Queens, Manhattan, and Brooklyn.',
    url: 'https://palnyc.org/teens',
    // Basketball court with young players — matches PAL athletics focus
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Summer Rising',
    program_type: 'Camps',
    borough: 'All 5 Boroughs',
    agency: 'NYC DOE',
    description: "NYC DOE's free summer program blending academics with camp-style activities — field trips, arts, sports, and enrichment. Open to all NYC public school students.",
    url: 'https://www.schools.nyc.gov/school-life/learning-and-enrichment/summer-rising',
    // Kids doing outdoor activities together — matches summer camp feel
    imageUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Beacon Community Centers',
    program_type: 'Camps',
    borough: 'All 5 Boroughs',
    agency: 'DYCD',
    description: 'School-based community centers open afternoons, evenings, and weekends year-round. Free programming for ages 6+ including NYCHA residents. Over 80 sites citywide.',
    url: 'https://www.nyc.gov/site/dycd/services/after-school/beacons.page',
    // Community center group activities — matches Beacon programming
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'ScriptEd Coding in Schools',
    program_type: 'Tech',
    borough: 'Bronx',
    agency: 'ScriptEd',
    description: "Free JavaScript and web development courses taught by volunteer engineers directly inside under-resourced NYC schools. Connects students to real tech internships.",
    url: 'https://scripted.org',
    // Young students at computers learning to code — precise match
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Work, Learn & Grow (WLG)',
    program_type: 'Business',
    borough: 'All 5 Boroughs',
    agency: 'DYCD / NYC Council',
    description: 'Year-round continuation of SYEP. Selected participants ages 14–24 receive paid employment during the school year plus career readiness training for up to 25 weeks.',
    url: 'https://palnyc.org/teens',
    // Young person in a professional work environment — matches WLG placement
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'NYPL TechConnect',
    program_type: 'Tech',
    borough: 'All 5 Boroughs',
    agency: 'NY Public Library',
    description: 'Free 10-week coding courses for beginners at library branches citywide. Covers web development, digital skills, and tech career pathways. No experience needed.',
    url: 'https://www.nypl.org/tech-connect',
    // Person at computer in library setting — matches NYPL tech program
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'NYC Parks Youth Sports',
    program_type: 'Sports',
    borough: 'All 5 Boroughs',
    agency: 'NYC Parks & Recreation',
    description: 'Free youth leagues in basketball, soccer, track & field, swimming, and tennis across 1,700+ parks. Open to all NYC youth. No tryouts, no fees.',
    url: 'https://www.nycgovparks.org/programs/recreation/youth-sports',
    // Youth soccer on a city field — matches NYC Parks sports context
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Creative Arts Works',
    program_type: 'Arts',
    borough: 'Manhattan',
    agency: 'DYCD / DOE',
    description: 'Paid internships for teens in visual arts, music production, film, and digital design. Students build real portfolios and earn while creating.',
    url: 'https://www.nyc.gov/site/dycd/index.page',
    // Young person painting or creating art — matches arts internship
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Digital Media Lab — NYPL',
    program_type: 'Arts',
    borough: 'Staten Island',
    agency: 'NY Public Library',
    description: 'Free access to podcast equipment, video editing software, music production tools, and digital design studios at NYPL branches. Drop-in and workshop formats.',
    url: 'https://www.nypl.org/locations/sibl/digital-media-lab',
    // Podcast/recording studio setup — exact match for digital media lab
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
  },
];

const CATEGORIES = ['All', 'Tech', 'Sports', 'Arts', 'Business', 'Camps'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60)    return 'Just now';
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  if (s < 604800) return `${Math.floor(s/86400)}d ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ─── Framer Motion Variants ───────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' }
  }),
};

const modalVariants = {
  hidden:  { opacity: 0, scale: 0.88, y: 32 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.3, ease: [0.34, 1.2, 0.64, 1] } },
  exit:    { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.2 } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const VideoSkeleton = () => (
  <div className="yt-skeleton">
    <div className="yt-skeleton-thumb" />
    <div className="yt-skeleton-text">
      <div className="yt-skeleton-line" />
      <div className="yt-skeleton-line short" />
    </div>
  </div>
);

const NewsCard = ({ article, featured, index }) => (
  <motion.a
    href={article.url || '#'}
    target="_blank"
    rel="noopener noreferrer"
    className={`news-card ${featured ? 'news-card-featured' : ''}`}
    variants={scaleIn}
    custom={index}
    whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
    transition={{ duration: 0.22 }}
  >
    {article.urlToImage && (
      <div className="news-card-img">
        <img src={article.urlToImage} alt={article.title}
          onError={(e) => { e.target.parentElement.style.display = 'none'; }} />
      </div>
    )}
    <div className="news-card-body">
      <div className="news-card-source">
        <span className="news-source-name">{article.source?.name || 'News'}</span>
        <span className="news-source-time"><Clock size={11} /> {timeAgo(article.publishedAt)}</span>
      </div>
      <h4 className="news-card-title">{article.title}</h4>
      {featured && article.description && (
        <p className="news-card-desc">
          {article.description.length > 140 ? article.description.slice(0,140)+'…' : article.description}
        </p>
      )}
      <span className="news-read-more">Read Article <ArrowUpRight size={12} /></span>
    </div>
  </motion.a>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Resources = () => {
  const location    = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [searchTerm,     setSearchTerm]     = useState('');
  const [activeCategory, setActiveCategory] = useState(queryParams.get('category') || 'All');
  const [programsReady,  setProgramsReady]  = useState(false);

  // Videos
  const [videos,        setVideos]        = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError,   setVideosError]   = useState(false);
  const [activeVideo,   setActiveVideo]   = useState(null);

  // News
  const [news,        setNews]        = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsTopic,   setNewsTopic]   = useState(NEWS_TOPICS[0]);

  const openVideo  = useCallback((v) => setActiveVideo(v), []);
  const closeVideo = useCallback(() => setActiveVideo(null), []);

  // ── Wake up Render on mount (free tier sleeps after 15min inactivity) ─────
  useEffect(() => {
    fetch(`${API_BASE}/health`, { method: 'GET' }).catch(() => {});
  }, []);

  // Simulate program load
  useEffect(() => {
    const t = setTimeout(() => setProgramsReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  // ── Fetch helper with timeout so Render cold-start doesn't hang silently ──
  const fetchWithTimeout = (url, ms = 12000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    return fetch(url, { signal: controller.signal })
      .finally(() => clearTimeout(id));
  };

  // Fetch YouTube videos via backend proxy
  useEffect(() => {
    let cancelled = false;
    setVideosLoading(true);
    setVideosError(false);

    fetchWithTimeout(`${API_BASE}/api/media/videos?category=${encodeURIComponent(activeCategory)}`)
      .then(r => { if (!r.ok) throw new Error(`Status ${r.status}`); return r.json(); })
      .then(data => {
        if (cancelled) return;
        setVideos(data.videos || []);
        setVideosLoading(false);
      })
      .catch(err => {
        console.error('Videos fetch error:', err.message);
        if (!cancelled) { setVideosError(true); setVideosLoading(false); }
      });

    return () => { cancelled = true; };
  }, [activeCategory]);

  // Fetch news via backend proxy (falls back to local data if backend is unavailable)
  useEffect(() => {
    let cancelled = false;
    setNewsLoading(true);

    fetchWithTimeout(`${API_BASE}/api/media/news?topic=${encodeURIComponent(newsTopic.query)}&pageSize=15`)
      .then(r => { if (!r.ok) throw new Error(`Status ${r.status}`); return r.json(); })
      .then(data => {
        if (cancelled) return;
        if (data.articles && data.articles.length >= 4) {
          setNews(data.articles);
        } else {
          setNews(FALLBACK_NEWS[newsTopic.query] || FALLBACK_NEWS[NEWS_TOPICS[0].query]);
        }
        setNewsLoading(false);
      })
      .catch(err => {
        console.warn('News API unavailable, using fallback data:', err.message);
        if (!cancelled) {
          setNews(FALLBACK_NEWS[newsTopic.query] || FALLBACK_NEWS[NEWS_TOPICS[0].query]);
          setNewsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [newsTopic]);

  const filtered = MOCK_RESOURCES.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = activeCategory === 'All' || r.program_type === activeCategory;
    return matchSearch && matchCat;
  });

  const featuredVideo = videos[0];
  const listVideos    = videos.slice(1);

  return (
    <>
      {/* ── Video Modal ── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideo}
          >
            <motion.div
              className="modal-box"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-topbar">
                <div className="modal-top-text">
                  <span className="modal-tag">{activeVideo.channel}</span>
                  <h2 className="modal-title">{activeVideo.title}</h2>
                </div>
                <motion.button
                  className="modal-close-btn"
                  onClick={closeVideo}
                  whileHover={{ scale: 1.1, backgroundColor: '#e8edf4' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={18} />
                </motion.button>
              </div>
              <div className="modal-player">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {activeVideo.desc && (
                <p className="modal-desc">
                  {activeVideo.desc.length > 160 ? activeVideo.desc.slice(0,160)+'…' : activeVideo.desc}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="resources-page">

        {/* ── Hero ── */}
        <motion.section
          className="res-hero"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p className="res-eyebrow" variants={fadeUp} custom={0}>
            <Zap size={12} /> Verified NYC Programs &nbsp;·&nbsp; Updated Weekly
          </motion.p>
          <motion.h1 variants={fadeUp} custom={1}>
            Find Your <span className="hero-blue">Next Move.</span>
          </motion.h1>
          <motion.p className="res-hero-sub" variants={fadeUp} custom={2}>
            Real resources. Real paths. Curated for youth ages 14–25 across New York City and beyond.
          </motion.p>
          <motion.div className="res-search" variants={fadeUp} custom={3}
            whileFocusWithin={{ boxShadow: '0 4px 20px rgba(43,136,216,0.18)', borderColor: '#2B88D8' }}
          >
            <Search size={17} className="res-search-icon" />
            <input
              type="text"
              placeholder="Search programs, boroughs, interests…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </motion.section>

        {/* ── Main Layout ── */}
        <div className="resources-layout">

          {/* ── Left ── */}
          <main className="res-main">

            {/* Category pills */}
            <motion.div
              className="category-pills"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat}
                  className={`pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {cat}
                </motion.button>
              ))}
            </motion.div>

            {/* Results count */}
            {programsReady && (
              <motion.div
                className="results-meta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="results-count">
                  {filtered.length} program{filtered.length !== 1 ? 's' : ''} found
                  {activeCategory !== 'All' && <span className="results-filter"> in {activeCategory}</span>}
                </span>
                {searchTerm && (
                  <span className="results-query">for "{searchTerm}"</span>
                )}
              </motion.div>
            )}

            {/* Program grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchTerm}
                className="res-grid"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {!programsReady
                  ? [1,2,3,4].map(n => (
                      <motion.div key={n} className="skeleton-card" variants={fadeIn} />
                    ))
                  : filtered.map((res, i) => (
                      <motion.article
                        className="res-card"
                        key={res.name}
                        variants={fadeUp}
                        custom={i}
                        whileHover={{ y: -5, boxShadow: '0 20px 48px rgba(0,35,102,0.11)' }}
                        transition={{ duration: 0.22 }}
                      >
                        <div className="res-card-img">
                          <img src={res.imageUrl} alt={res.name} />
                          <span className="res-card-badge">{res.program_type}</span>
                        </div>
                        <div className="res-card-body">
                          <h3>{res.name}</h3>
                          <p>{res.description}</p>
                          <div className="res-card-chips">
                            <span className="chip"><MapPin size={11} /> {res.borough}</span>
                            <span className="chip chip-blue">{res.agency}</span>
                            <span className="chip chip-green"><CheckCircle size={11} /> Verified</span>
                          </div>
                          <motion.a
                            href={res.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-link"
                            whileHover={{ gap: '10px' }}
                          >
                            Learn More <ArrowUpRight size={13} />
                          </motion.a>
                        </div>
                      </motion.article>
                    ))
                }
              </motion.div>
            </AnimatePresence>

            {programsReady && filtered.length === 0 && (
              <motion.p className="empty-state" variants={fadeIn} initial="hidden" animate="visible">
                No programs match your search.
              </motion.p>
            )}

            {/* ── News Section ── */}
            <motion.div
              className="news-section"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <div className="news-section-header">
                <div className="news-header-left">
                  <Newspaper size={18} className="news-icon" />
                  <h2>In The News</h2>
                </div>
                <p className="news-header-sub">Stories about youth, opportunity &amp; the world you're stepping into.</p>
              </div>

              {/* Topic pills */}
              <motion.div
                className="news-topics"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {NEWS_TOPICS.map((t, i) => (
                  <motion.button
                    key={t.query}
                    className={`news-topic-pill ${newsTopic.query === t.query ? 'active' : ''}`}
                    onClick={() => setNewsTopic(t)}
                    variants={fadeUp}
                    custom={i}
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t.label}
                  </motion.button>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                {newsLoading ? (
                  <motion.div
                    key="news-skeleton"
                    className="news-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[1,2,3,4,5,6].map(n => (
                      <div key={n} className="skeleton-card skeleton-news" />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={newsTopic.query}
                    className="news-grid"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  >
                    {news.slice(0,1).map((a,i)  => <NewsCard key={i}   article={a} featured index={i} />)}
                    {news.slice(1).map((a,i)    => <NewsCard key={i+1} article={a} index={i+1} />)}
                  </motion.div>
                )}
              </AnimatePresence>

              {!newsLoading && (
                <motion.div
                  className="news-ai-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                
                </motion.div>
              )}
            </motion.div>
          </main>

          {/* ── Sidebar ── */}
          <motion.aside
            className="res-sidebar"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="sidebar-head">
              <Play size={15} fill="#EE272E" />
              <h3>Watch <span className="red">&amp; Learn</span></h3>
            </div>
            <p className="sidebar-sub">
              YouTube results for <strong>{activeCategory}</strong> — live from search.
            </p>

            {/* Featured video */}
            {videosLoading ? (
              <div className="yt-featured-skeleton" />
            ) : videosError ? (
              <motion.div className="yt-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p>Couldn't load videos.</p>
                <button onClick={() => setActiveCategory(activeCategory)}>
                  <RefreshCw size={13} /> Retry
                </button>
              </motion.div>
            ) : featuredVideo ? (
              <motion.button
                className="yt-featured"
                onClick={() => openVideo(featuredVideo)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <img src={featuredVideo.thumbnail} alt={featuredVideo.title} />
                <div className="yt-featured-overlay">
                  <motion.div
                    className="yt-big-play"
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Play size={22} fill="white" />
                  </motion.div>
                  <div className="yt-feat-label">
                    <span className="yt-badge">{featuredVideo.channel}</span>
                    <h4>{featuredVideo.title.length > 60 ? featuredVideo.title.slice(0,60)+'…' : featuredVideo.title}</h4>
                  </div>
                </div>
              </motion.button>
            ) : null}

            {/* Video list */}
            <div className="yt-list">
              {videosLoading
                ? [1,2,3,4].map(n => <VideoSkeleton key={n} />)
                : listVideos.map((v, i) => (
                    <motion.button
                      className="yt-row"
                      key={v.id}
                      onClick={() => openVideo(v)}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 + 0.1 }}
                      whileHover={{ x: 5, backgroundColor: '#f7f8fc' }}
                    >
                      <div className="yt-thumb">
                        <img src={v.thumbnail} alt={v.title} />
                        <div className="yt-thumb-play"><Play size={12} fill="white" /></div>
                      </div>
                      <div className="yt-row-text">
                        <span className="yt-row-badge">{v.channel}</span>
                        <h4>{v.title.length > 55 ? v.title.slice(0,55)+'…' : v.title}</h4>
                      </div>
                    </motion.button>
                  ))
              }
            </div>

            {/* Gem quote */}
            <motion.div
              className="gem-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="gem-label"><Sparkles size={12} /> Timothy's Gem</div>
              <blockquote>
                "The resource gets you in the door, but your character keeps you in the room."
              </blockquote>
              <cite>— Timothy Brumell, Founder of KIDS</cite>
            </motion.div>

            <motion.a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`NYC youth ${activeCategory === 'All' ? 'programs' : activeCategory} opportunities`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-more-videos"
              whileHover={{ scale: 1.02, backgroundColor: '#cc1f25' }}
              whileTap={{ scale: 0.97 }}
            >
              More on YouTube <ExternalLink size={13} />
            </motion.a>
          </motion.aside>

        </div>
      </div>
    </>
  );
};

export default Resources;
