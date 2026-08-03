'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

const CARD_DATA = [
  // DEBT
  { id: 1, category: "DEBT", stat: "₦144.7 TRILLION", label: "Nigeria's total public debt as of Dec 2024 (DMO)", source: "DMO Total Public Debt Dec 2024", sourceUrl: "https://www.dmo.gov.ng/debt-profile/total-public-debt", detail: "DMO reported Nigeria's total public debt at about ₦144.67 trillion as of 31 December 2024 (up from ₦97.34 trillion at end-2023). Q1 2024 was about ₦121.67 trillion. By end-2025 the stock had risen further (DMO ~₦159 trillion). Naira figures rose partly from new borrowing and partly from FX revaluation of external debt." },
  { id: 2, category: "DEBT", stat: "₦47+ TRILLION", label: "Naira debt stock rise Dec 2023 to Dec 2024 alone", source: "DMO Nigeria", sourceUrl: "https://www.dmo.gov.ng/debt-profile/total-public-debt", detail: "Public debt rose from about ₦97.3 trillion (end-2023) to about ₦144.7 trillion (end-2024) — a ~₦47 trillion increase in one year under Tinubu. Part of the naira jump is FX revaluation after the float, not only new cash loans. Still one of the sharpest naira-debt expansions on record." },
  { id: 3, category: "DEBT", stat: "$42.1 BILLION", label: "External debt stock as of Q1 2024 (NBS/DMO)", source: "NBS / DMO Debt Report Q1 2024", sourceUrl: "https://www.dmo.gov.ng/debt-profile/external-debts/external-debt-stock", detail: "NBS reported total external debt at about $42.12 billion (₦56.02 trillion) in Q1 2024. External debt must be serviced in foreign currency, pressuring reserves and the naira. Later quarters showed further naira and dollar-stock movements as rates and borrowings changed." },
  { id: 4, category: "DEBT", stat: "100%+", label: "Debt service often exceeds federal revenue", source: "IMF / BudgIT / NES Group", sourceUrl: "https://www.imf.org/en/countries/NGA", detail: "IMF and fiscal trackers show Nigeria's debt service-to-revenue ratio has repeatedly exceeded 100% in recent years (e.g. estimates above 100–150% in stressed periods). That means more than every naira of federal revenue can be committed to creditors before funding health, education, or security." },
  { id: 5, category: "DEBT", stat: "₦8.25 TRILLION", label: "2024 deficit budget approved under Tinubu", source: "Federal Budget 2024", sourceUrl: "https://www.budgetoffice.gov.ng/", detail: "The 2024 federal budget was signed with a multi-trillion-naira deficit (commonly cited around ₦8+ trillion depending on final Appropriation figures), meaning large new borrowing was built into the fiscal plan. Deficits are financed mainly through domestic and external borrowing." },
  { id: 6, category: "DEBT", stat: "96%", label: "Federal revenue to debt service peak (IMF era figure)", source: "IMF / Brookings (2022 baseline)", sourceUrl: "https://www.brookings.edu/articles/fiscal-policy-options-for-growing-out-of-debt-evidence-from-nigeria/", detail: "IMF-linked reporting put federal interest/debt service near ~96% of FGN revenue around 2022 — the crisis Tinubu inherited and that continued into 2023–24 under high rates and a weaker naira. Exact yearly ratios vary, but the structural problem is undisputed: debt service crowds out social spending." },
  { id: 7, category: "DEBT", stat: "₦3.5T+", label: "Quarterly debt service costs at multi-trillion scale", source: "DMO / Punch reporting 2024", sourceUrl: "https://www.dmo.gov.ng/", detail: "DMO and press reporting put total debt service (domestic + external) in the multi-trillion naira range per quarter in 2024 (e.g. ~₦3.57 trillion cited for Q3 2024). That pace rivals or exceeds entire annual budgets of major social ministries." },
  { id: 8, category: "DEBT", stat: "$90–110B", label: "Public debt in dollar terms (range by period)", source: "DMO / NBS", sourceUrl: "https://www.dmo.gov.ng/debt-profile/total-public-debt", detail: "Nigeria's consolidated public debt (federal + subnational external/domestic as reported by DMO) has hovered roughly in the $90–110+ billion band depending on quarter and exchange rate. State debts sit inside DMO totals; contingent liabilities can be higher still." },
  { id: 9, category: "DEBT", stat: "₦650,000+", label: "Every Nigerian's share of national public debt", source: "DMO / population estimate", sourceUrl: "https://www.dmo.gov.ng/debt-profile/total-public-debt", detail: "At ~₦144.7 trillion (end-2024) and ~220 million people, each Nigerian's share is on the order of ₦650,000+ — not ₦35,000. Per-capita debt has risen as the naira stock expanded faster than population or real incomes." },
  { id: 10, category: "DEBT", stat: "CAA1→B3", label: "Moody's still speculative-grade; upgraded May 2025", source: "Moody's / Reuters May 2025", sourceUrl: "https://www.reuters.com/world/africa/moodys-upgrades-nigerias-rating-b3-better-external-fiscal-positions-2025-05-30/", detail: "Nigeria was already deep in speculative ('junk') territory before and early in Tinubu's term (e.g. Moody's Caa1). Moody's upgraded Nigeria to B3 in May 2025 citing external/fiscal improvements — still non-investment grade. High borrowing costs for taxpayers remain." },
  { id: 11, category: "DEBT", stat: "₦74.4 TRILLION", label: "Domestic debt stock end-2024 (DMO)", source: "DMO Nigeria Dec 2024", sourceUrl: "https://www.dmo.gov.ng/debt-profile/total-public-debt", detail: "DMO put domestic debt at about ₦74.38 trillion as of December 2024 (up from ~₦59 trillion end-2023). Earlier 2024 quarters already showed domestic debt well above ₦60 trillion — not ₦28.7 trillion. High domestic borrowing crowds out private credit and lifts yields." },
  { id: 12, category: "DEBT", stat: "500%", label: "Increase in debt service since 2015", source: "Budget Office / fiscal trackers", sourceUrl: "https://www.budgetoffice.gov.ng/", detail: "Nigeria's annual debt service has multiplied several-fold since 2015 as the debt stock and interest rates rose — from roughly ₦1 trillion-scale levels toward multi-trillion annual service. Exact percentages depend on the start/end budget year chosen; the crowding-out effect is clear." },
  { id: 13, category: "DEBT", stat: "₦9.7 TRILLION", label: "2025 budget deficit projected", source: "Federal Budget 2025", sourceUrl: "https://www.budgetoffice.gov.ng/", detail: "The 2025 federal budget was framed with a large multi-trillion deficit (widely reported near ₦9+ trillion depending on final Appropriation). That deficit is financed through further domestic and external borrowing on top of an already heavy debt stock." },
  { id: 14, category: "DEBT", stat: "TOP TIER", label: "Among SSA's worst debt-service-to-revenue pressures", source: "IMF / World Bank analyses", sourceUrl: "https://www.worldbank.org/en/country/nigeria", detail: "IMF and World Bank analyses have repeatedly flagged Nigeria's debt service-to-revenue ratio as among the most severe in Sub-Saharan Africa. Debt-to-GDP can look moderate while liquidity stress remains extreme because revenue collection is weak." },
  { id: 15, category: "DEBT", stat: "₦22.7 TRILLION", label: "CBN Ways & Means stock securitised (2023)", source: "NASS / BudgIT / World Bank", sourceUrl: "https://budgit.org/securitization-of-the-n23-7tn-ways-and-means-debt-legality-and-appropriateness/", detail: "Parliament approved securitisation of roughly ₦22.7–23.7 trillion in CBN Ways & Means advances (stock through late 2022) into long-tenor bonds in 2023 — not ₦2.4 trillion. Monetising the deficit was highly inflationary and remains a core part of Nigeria's debt legacy." },

  // ECONOMY
  { id: 16, category: "ECONOMY", stat: "₦1,900+", label: "Dollar exchange rate after Tinubu floated naira in 2023", source: "CBN Data", sourceUrl: "https://www.cbn.gov.ng/", detail: "Within days of taking office, Tinubu floated the naira, sending the official dollar rate from ₦465 to over ₦1,900. While some economists supported unification, the unmanaged float triggered immediate and severe increases in the cost of imported goods, fuel, and medicines." },
  { id: 17, category: "ECONOMY", stat: "34.8%", label: "Inflation rate as of November 2024", source: "NBS Nigeria", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "Nigeria's headline inflation hit 34.8% in November 2024 — the highest in nearly three decades. Every ₦100 in savings lost ₦35 of purchasing power in a single year. Workers' salaries, already inadequate, became worth dramatically less in real terms." },
  { id: 18, category: "ECONOMY", stat: "700%", label: "Petrol price increase after subsidy removal", source: "NNPCL 2023", sourceUrl: "https://nnpcgroup.com/", detail: "Petrol prices rose by over 700% after Tinubu removed the fuel subsidy on his inauguration day in May 2023. The price per litre shot from ₦185 to over ₦1,030 by late 2024, cascading into higher food prices, transport costs, and electricity tariffs nationwide." },
  { id: 19, category: "ECONOMY", stat: "40.9%", label: "Food inflation rate in Nigeria, 2024", source: "NBS Nigeria", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "Food inflation in Nigeria reached 40.9% in 2024 — meaning food prices rose 40% in a single year. For a population that spends 60%+ of income on food, this is catastrophic. It has pushed tens of millions from food insecurity into outright hunger." },
  { id: 20, category: "ECONOMY", stat: "63%", label: "Nigerians multi-dimensionally poor (NBS MPI baseline)", source: "NBS Multidimensional Poverty Index 2022", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "NBS (with OPHI) found about 63% of Nigerians — roughly 133 million people — are multi-dimensionally poor (2022 MPI). That is far worse than a 'one in three' headline. Deprivations span health, education, living standards, and work — not income alone." },
  { id: 21, category: "ECONOMY", stat: "₦70,000", label: "New minimum wage signed July 2024, grossly inadequate against 34% inflation", source: "FGN / NLC 2024", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "President Tinubu signed Nigeria's new National Minimum Wage at ₦70,000 in July 2024, up from ₦30,000. Labour unions demanded ₦494,000 based on a living wage calculation. At ₦70,000, a worker cannot cover basic rent, transport, and food in any major Nigerian city — the real value of wages continues to fall." },
  { id: 22, category: "ECONOMY", stat: "64%", label: "Nigerians who cannot afford a meal daily", source: "WFP Nigeria 2024", sourceUrl: "https://www.wfp.org/countries/nigeria", detail: "The World Food Programme found that 64% of Nigerians cannot reliably afford a daily meal. This represents a catastrophic collapse in food security driven by hyperinflation, currency devaluation, and insecurity destroying farming communities in the North." },
  { id: 23, category: "ECONOMY", stat: "87 MILLION", label: "Nigerians in extreme poverty as of 2024", source: "World Bank 2024", sourceUrl: "https://www.worldbank.org/en/country/nigeria", detail: "The World Bank estimates 87 million Nigerians live in extreme poverty — earning less than $2.15 per day. Nigeria has the largest number of extremely poor people on the African continent, despite being Africa's largest economy by nominal GDP." },
  { id: 24, category: "ECONOMY", stat: "5TH HIGHEST", label: "Nigeria's global poverty ranking", source: "Brookings Institution 2024", sourceUrl: "https://www.brookings.edu/", detail: "Brookings Institution ranks Nigeria 5th globally in extreme poverty headcount. Despite being Africa's largest economy, wealth remains concentrated in a tiny elite. Nigeria's poverty rate has worsened, not improved, under democratic governance." },
  { id: 25, category: "ECONOMY", stat: "₦470→₦900+", label: "Price of a loaf of bread, 2023 vs 2024", source: "NBS Market Data", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "The price of a standard loaf of bread more than doubled in one year — from ₦470 in 2023 to over ₦900 in 2024. This reflects broader food inflation driven by rising energy costs, currency collapse, and supply chain disruptions caused by insecurity." },
  { id: 26, category: "ECONOMY", stat: "3.19%", label: "GDP growth Q3 2024 — weak vs living costs", source: "NBS Q3 2024", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "NBS put real GDP growth near 3.19% in Q3 2024. Even when growth exceeds population growth (~2.4–2.6%), high inflation means real incomes and welfare can still fall — 'growth without shared development' for most households." },
  { id: 27, category: "ECONOMY", stat: "5.3%", label: "Official unemployment Q1 2024 (ILO method) — job quality still dire", source: "NBS NLFS Q1 2024", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "Under NBS's new ILO-aligned Labour Force Survey, unemployment was 5.3% in Q1 2024 (time-related underemployment ~9–10% band depending on quarter). That is NOT 53%. The old 33%+ definition was retired. High poverty with low official unemployment reflects informal, low-pay work — not full employment." },
  { id: 28, category: "ECONOMY", stat: "₦1,900+", label: "Parallel market dollar peaks after the float", source: "CBN / Market Reports", sourceUrl: "https://www.cbn.gov.ng/", detail: "After the 2023 float, parallel/official rates spiked well above ₦1,500 and at peaks approached or exceeded ~₦1,900 in stress periods. Spreads and volatility hurt importers and households even when official rates later moderated." },
  { id: 29, category: "ECONOMY", stat: "SMEs HIT", label: "Widespread SME stress after subsidy removal & devaluation", source: "Chambers / industry reports", sourceUrl: "https://naccima.com/", detail: "Business associations and industry surveys reported mass SME distress, closures, and scaled-down operations after fuel subsidy removal and naira devaluation raised transport, energy, and import costs. Treat large round '1 million closures' claims as advocacy figures unless a named audited survey is cited." },
  { id: 30, category: "ECONOMY", stat: "~230%", label: "Band A electricity tariff hike April 2024 (₦68→₦225)", source: "NERC April 2024 Order", sourceUrl: "https://nerc.gov.ng/", detail: "NERC raised Band A (20+ hours) tariffs from about ₦68/kWh to ₦225/kWh in April 2024 — roughly a 230% increase (about 3×), later adjusted slightly downward then re-tweaked. Combined with expensive diesel for generators, this hammered manufacturers and SMEs." },

  // INSECURITY
  { id: 31, category: "INSECURITY", stat: "11,000+", label: "Nigerians killed by bandits and insurgents in 2023", source: "ACLED Nigeria 2023", sourceUrl: "https://acleddata.com/", detail: "The Armed Conflict Location & Event Data Project recorded over 11,000 Nigerians killed by bandits, Boko Haram, ISWAP, and other armed groups in 2023. This death toll exceeds that of many officially recognised conflict zones globally." },
  { id: 32, category: "INSECURITY", stat: "3.1 MILLION", label: "Internally displaced persons in Nigeria 2024", source: "UNHCR Nigeria", sourceUrl: "https://www.unhcr.org/countries/nigeria", detail: "Over 3.1 million Nigerians have been forced from their homes by violence and are living as internally displaced persons. The Northeast (Borno, Adamawa, Yobe) and Northwest (Zamfara, Katsina) account for the majority of Nigeria's massive IDP population." },
  { id: 33, category: "INSECURITY", stat: "TOP 10", label: "Nigeria consistently among worst-hit on Global Terrorism Index", source: "Global Terrorism Index (IEP)", sourceUrl: "https://www.visionofhumanity.org/maps/global-terrorism-index/", detail: "The Institute for Economics & Peace Global Terrorism Index has repeatedly placed Nigeria in the global top tier for terrorism impact (rank has moved between roughly 4th–8th depending on report year). Boko Haram, ISWAP, and related violence drive the score — not a one-year anomaly." },
  { id: 34, category: "INSECURITY", stat: "1,500+", label: "Farmers killed in North-Central conflict zones 2024", source: "ACLED Data", sourceUrl: "https://acleddata.com/", detail: "Over 1,500 farmers were killed in the North-Central conflict zones between farmers and herders in 2024. This crisis has devastated food production in Nigeria's 'Middle Belt food belt,' contributing to food inflation and hunger nationwide." },
  { id: 35, category: "INSECURITY", stat: "36 STATES", label: "All 36 states now record active security incidents", source: "DSS Reports", sourceUrl: "https://www.dss.gov.ng/", detail: "For the first time in Nigeria's modern history, all 36 states record active security incidents — from mass kidnappings and banditry in the North to cultism, pipeline vandalism, and piracy in the South. No Nigerian state can be called fully safe." },
  { id: 36, category: "INSECURITY", stat: "548", label: "Kidnappings recorded in first half of 2024 alone", source: "SBM Intelligence", sourceUrl: "https://www.sbmintel.com/", detail: "SBM Intelligence recorded 548 kidnapping incidents in just the first half of 2024. Nigeria has become the kidnapping capital of West Africa. Criminal gangs target schools, churches, highways, and farms — with ransom demands running into hundreds of millions of naira." },
  { id: 37, category: "INSECURITY", stat: "6,000+", label: "People killed by Boko Haram affiliates since 2022", source: "UN OCHA", sourceUrl: "https://www.unocha.org/nigeria", detail: "Boko Haram and its ISWAP splinter group have killed over 6,000 people since 2022 in the Northeast. Despite years of military operations and billions in security spending, the insurgency remains active across Borno, Adamawa, and Yobe states." },
  { id: 38, category: "INSECURITY", stat: "₦1.3 TRILLION", label: "Security budget that failed to stop terror", source: "Federal Budget 2024", sourceUrl: "https://www.budgetoffice.gov.ng/", detail: "Nigeria allocated ₦1.3 trillion to defence and security in 2024, yet killings, kidnappings, and displacement continue to rise. This raises profound questions about procurement corruption, mismanagement, and strategic failure in Nigeria's security establishment." },
  { id: 39, category: "INSECURITY", stat: "280", label: "School children kidnapped in Kuriga, Kaduna 2024", source: "Reuters / BBC", sourceUrl: "https://www.bbc.com/news/world/africa/nigeria", detail: "In March 2024, gunmen abducted 280 school children from Government Secondary School Kuriga in Kaduna State. The mass kidnapping echoed the 2014 Chibok abductions and underscored the government's inability to protect Nigeria's children from armed criminals." },
  { id: 40, category: "INSECURITY", stat: "29 MILLION", label: "Nigerians facing acute food insecurity due to conflict", source: "WFP 2024", sourceUrl: "https://www.wfp.org/countries/nigeria", detail: "The World Food Programme estimates 29 million Nigerians face acute food insecurity driven partly by armed conflict. In areas under bandit control, farmers cannot access their land. Aid convoys face attacks. The food-security-conflict spiral continues to deepen." },
  { id: 41, category: "INSECURITY", stat: "600+", label: "Police officers killed on duty in 2023", source: "NPF Report", sourceUrl: "https://www.npf.gov.ng/", detail: "Over 600 Nigerian police officers were killed on duty in 2023, according to NPF data. This reflects the extreme danger faced by underpaid, under-equipped security personnel against heavily armed criminal and insurgent groups." },
  { id: 42, category: "INSECURITY", stat: "83%", label: "Nigerians who feel unsafe in their communities", source: "Afrobarometer 2024", sourceUrl: "https://www.afrobarometer.org/country/nigeria/", detail: "Afrobarometer's 2024 survey found 83% of Nigerians feel unsafe in their own communities — the highest fear-of-crime rating in the survey's Nigerian history. Physical insecurity has become the defining daily experience for the majority of Nigerians." },
  { id: 43, category: "INSECURITY", stat: "DAILY", label: "Frequency of bandit attacks in Northwest Nigeria", source: "ACLED 2024", sourceUrl: "https://acleddata.com/", detail: "ACLED data confirms bandit attacks in Nigeria's Northwest have become a daily occurrence. Villages in Zamfara, Katsina, Sokoto, and Kebbi states face regular raids, killings, cattle rustling, and kidnappings. Many communities have been permanently abandoned." },
  { id: 44, category: "INSECURITY", stat: "2,200+", label: "Killed in Plateau State communal violence 2023-2024", source: "HRW Nigeria", sourceUrl: "https://www.hrw.org/africa/nigeria", detail: "Human Rights Watch documented over 2,200 people killed in Plateau State communal violence between 2023-2024. These attacks follow patterns of ethnic and religious targeting, displacing entire farming communities and destroying livelihoods built over generations." },
  { id: 45, category: "INSECURITY", stat: "ZERO", label: "Senior terrorists convicted under Tinubu administration", source: "Amnesty International", sourceUrl: "https://www.amnesty.org/en/countries/africa/nigeria/", detail: "Amnesty International has found that no senior Boko Haram or ISWAP commanders have been successfully convicted in civilian courts under Tinubu. The culture of impunity for terrorism — where leaders are sometimes 'rehabilitated' rather than prosecuted — continues." },

  // GOVERNANCE
  { id: 46, category: "GOVERNANCE", stat: "FREQUENT", label: "Heavy foreign travel while domestic crises continued", source: "Media trip trackers / State House", sourceUrl: "https://statehouse.gov.ng/", detail: "Independent media tallies show extensive presidential foreign travel (medical, summits, bilateral visits). Exact '6 of 12 months' claims vary by methodology and should be treated as estimates. Pattern remains: long absences during acute cost-of-living and security pressures at home." },
  { id: 47, category: "GOVERNANCE", stat: "140TH", label: "Transparency International CPI 2024 rank (score 26/100)", source: "Transparency International CPI 2024", sourceUrl: "https://www.transparency.org/en/cpi/2024", detail: "CPI 2024 ranked Nigeria 140th of 180 (score 26), improved slightly from 145th/25 in 2023. CPI 2025 placed Nigeria around 142nd with the same score of 26. Still far below the global average — not a clean bill of health, but not '148th' either." },
  { id: 48, category: "GOVERNANCE", stat: "NEPOTISM RISK", label: "Family & ally influence over state power and deals", source: "Investigative media (various)", sourceUrl: "https://www.thecable.ng/", detail: "Multiple outlets have reported Tinubu family and political-ally influence over appointments, business proximity, and access. A widely shared claim that Seyi Tinubu was 'given an oil bloc in 2024' is not solidly verified as a formal DMO/NUPRC grant to him personally — treat as unproven unless a primary award document is cited. Nepotism concerns remain a live accountability issue." },
  { id: 49, category: "GOVERNANCE", stat: "DISPUTED", label: "Tinubu's Chicago State credentials remain contested", source: "Court / election petition records", sourceUrl: "https://www.supremecourt.gov.ng/", detail: "Chicago State University records and election-petition litigation left public disputes over details of Tinubu's academic history. Nigerian courts did not remove him from office over the issue. The controversy is real; 'forged certificate proven in court' is not an accurate summary." },
  { id: 50, category: "GOVERNANCE", stat: "$460,000", label: "US civil forfeiture 1993 — not a criminal conviction", source: "US District Court N.D. Illinois records", sourceUrl: "https://www.plainsite.org/dockets/2jqi9omh8/illinois-northern-district-court/usa-v-acct-263226700-et-al/", detail: "In 1993 a US court ordered civil forfeiture of $460,000 from accounts in Bola Tinubu's name tied by investigators to a heroin-trafficking network (Akande/Agbele). Civil forfeiture is not the same as a criminal conviction; Tinubu was not convicted in a US criminal trial on that matter. The court record itself is public and long-cited." },
  { id: 51, category: "GOVERNANCE", stat: "CIVIL CASE", label: "US records linked accounts to Akande heroin network", source: "US Court / IRS affidavits (public reporting)", sourceUrl: "https://www.justice.gov/", detail: "US civil case materials and investigative reporting describe bank accounts in Tinubu's name as receiving funds investigators treated as proceeds connected to Mueez Akande's heroin organisation. No US criminal conviction of Tinubu is on that docket. Accurate accountability requires stating civil forfeiture vs criminal guilt clearly." },
  { id: 52, category: "GOVERNANCE", stat: "8 AGENCIES", label: "Merged without legislative approval or transparency", source: "FGN Gazette 2023", sourceUrl: "https://osg.gov.ng/", detail: "Tinubu merged 8 federal agencies without National Assembly approval in 2023. The mergers — affecting power sector and other agencies — bypassed constitutional processes requiring legislative involvement, setting a precedent for executive overreach." },
  { id: 53, category: "GOVERNANCE", stat: "NO DEBATE", label: "Refused to participate in presidential debates in 2023", source: "INEC / Media Records", sourceUrl: "https://www.inecnigeria.org/", detail: "Tinubu refused to participate in presidential debates ahead of the 2023 election, unlike all other major candidates. He offered no detailed policy positions and avoided direct media scrutiny, relying entirely on the APC political machinery to deliver votes." },
  { id: 54, category: "GOVERNANCE", stat: "ALAUSA FILES", label: "Mass procurement fraud linked to Lagos governorship", source: "EFCC Reports / HRW", sourceUrl: "https://efccnigeria.org/", detail: "EFCC investigations and Human Rights Watch reports documented widespread procurement irregularities during Tinubu's tenure as Lagos Governor. The 'Alausa Files' — named for the Lagos secretariat — detail billions in questionable public spending." },
  { id: 55, category: "GOVERNANCE", stat: "4 YEARS", label: "Promised transformation. Asking for second term before finishing first", source: "Campaign Records 2023", sourceUrl: "https://www.inecnigeria.org/", detail: "Tinubu campaigned on a 'Renewed Hope' transformation agenda for Nigeria. Yet within months, his political allies were already mobilising for a second term before completing Year 1 — with living standards having declined sharply for most Nigerians." },
  { id: 56, category: "GOVERNANCE", stat: "₦800 MILLION", label: "Daily presidential running cost estimate", source: "Budget Office Leaks", sourceUrl: "https://www.budgetoffice.gov.ng/", detail: "Investigative reporters and budget documents suggest the daily cost of running Nigeria's presidency exceeds ₦800 million — including salaries, security details, travel, entertainment, and maintenance of multiple presidential residences and lodges." },
  { id: 57, category: "GOVERNANCE", stat: "45", label: "Ministers sworn in Aug 2023 — one of largest cabinets", source: "Reuters / State House 2023", sourceUrl: "https://www.reuters.com/world/africa/nigerias-tinubu-swears-45-ministers-amid-concerns-over-growth-insecurity-2023-08-21/", detail: "President Tinubu swore in 45 ministers in August 2023 — larger than Buhari's first-term cabinet and among the largest since 1999. Later reshuffles adjusted the count further. A large cabinet raises the wage bill without automatically improving service delivery." },
  { id: 58, category: "GOVERNANCE", stat: "DISPUTED DEGREE", label: "Chicago State records fuelled certificate controversy", source: "Court / election petition documents", sourceUrl: "https://www.supremecourt.gov.ng/", detail: "Documents produced in US and Nigerian litigation around Chicago State University fuelled public dispute over Tinubu's academic record. Opponents alleged forgery; courts did not disqualify him. Accurate wording: disputed credentials and incomplete public clarity — not a final court finding of forgery." },
  { id: 59, category: "GOVERNANCE", stat: "CABAL", label: "Key decisions made by unelected inner circle", source: "The Cable Investigations", sourceUrl: "https://www.thecable.ng/", detail: "The Cable and other investigative outlets documented how an unelected inner circle — comprising family members, godfather figures, and political allies — controls access to Tinubu and drives major policy, appointment, and budgetary decisions outside democratic accountability." },
  { id: 60, category: "GOVERNANCE", stat: "ZERO", label: "Town halls held with ordinary Nigerians since inauguration", source: "State House Records", sourceUrl: "https://www.statehouse.gov.ng/", detail: "Since assuming office, Tinubu has not held a single open town hall or public meeting with ordinary Nigerian citizens. His media interactions are rare, scripted, and staged — a sharp contrast with democratic norms of accountability to the electorate." },

  // HEALTH
  { id: 61, category: "HEALTH", stat: "TOP TIER", label: "Among world's highest maternal mortality burdens", source: "WHO / UNICEF maternal mortality estimates", sourceUrl: "https://data.unicef.org/topic/maternal-health/maternal-mortality/", detail: "Nigeria carries one of the world's highest absolute numbers of maternal deaths and a very high maternal mortality ratio. Rankings by rate vs absolute deaths differ by source year, but the emergency is undisputed: preventable pregnancy deaths remain mass-scale." },
  { id: 62, category: "HEALTH", stat: "~1,000", label: "Maternal deaths per 100,000 live births (WHO-range)", source: "WHO / World Bank / Macrotrends", sourceUrl: "https://data.worldbank.org/indicator/SH.STA.MMRT?locations=NG", detail: "Recent modeled estimates put Nigeria's maternal mortality ratio near ~993–1,047 deaths per 100,000 live births (not 2,300). That is still among the world's worst rates and reflects collapsed emergency obstetric care, cost barriers, and weak facilities." },
  { id: 63, category: "HEALTH", stat: "800%", label: "Drug price increase after naira devaluation", source: "NAFDAC / Pharmacists Reports", sourceUrl: "https://www.nafdac.gov.ng/", detail: "Following the naira devaluation, drug prices increased by up to 800% as Nigeria imports approximately 70% of its pharmaceutical needs. Many patients with chronic conditions — hypertension, diabetes, HIV, epilepsy — can no longer afford their essential medications." },
  { id: 64, category: "HEALTH", stat: "1 DOCTOR", label: "Per 5,000 patients — Nigeria's doctor-patient ratio", source: "NMA 2024", sourceUrl: "https://www.nma.com.ng/", detail: "The Nigerian Medical Association estimates there is just 1 doctor for every 5,000 patients in Nigeria — far below the WHO-recommended ratio of 1:600. This crisis-level shortage is worsened by mass emigration of trained doctors who see no future in Nigeria's broken system." },
  { id: 65, category: "HEALTH", stat: "16,000+", label: "Doctors who emigrated from Nigeria in 3 years", source: "NMA 2024", sourceUrl: "https://www.nma.com.ng/", detail: "Over 16,000 Nigerian doctors emigrated between 2021-2024, according to NMA records. The UK, US, Canada, and Australia are primary destinations. Nigeria trains doctors at public expense, then watches them leave — effectively subsidising richer countries' health systems." },
  { id: 66, category: "HEALTH", stat: "BRAIN DRAIN", label: "Nigeria losing top medical personnel at record pace", source: "WHO / NMA Reports", sourceUrl: "https://www.who.int/nigeria", detail: "Nigeria is experiencing the worst medical brain drain in its history. Specialists in surgery, cardiology, oncology, and neurology are leaving in droves. Those who remain face poor pay, broken equipment, and the daily trauma of practising medicine without basic supplies." },
  { id: 67, category: "HEALTH", stat: "UNDER 15%", label: "Health budget far below Abuja Declaration 15% target", source: "Federal Budget / health budget trackers", sourceUrl: "https://www.budgetoffice.gov.ng/", detail: "Nigeria has chronically underfunded health versus the Abuja Declaration target of 15% of the national budget. Exact 2024 health envelope figures vary by whether you count FMOH only or broader health votes — but debt service has repeatedly rivalled or exceeded social sectors. Verify final Appropriation tables for any single-year naira headline." },
  { id: 68, category: "HEALTH", stat: "70%", label: "Public hospitals without regular power supply", source: "FMOH Report 2023", sourceUrl: "https://www.health.gov.ng/", detail: "The Federal Ministry of Health's own audit found 70% of public hospitals lack reliable power supply. Without electricity, hospitals cannot sterilise equipment, power ventilators, maintain drug cold chains, or run basic diagnostic equipment. People die for this reason." },
  { id: 69, category: "HEALTH", stat: "MEDICAL TOURISM", label: "Tinubu travels abroad for medical treatment", source: "Media Reports", sourceUrl: "https://www.premiumtimesng.com/", detail: "President Tinubu has reportedly sought medical treatment in France and Europe on multiple occasions while Nigeria's public hospitals remain dysfunctional. Nigerian leaders routinely flee the very healthcare system they are elected and paid to fix." },
  { id: 70, category: "HEALTH", stat: "1 IN 4", label: "Children under 5 stunted due to malnutrition in Nigeria", source: "UNICEF Nigeria 2024", sourceUrl: "https://www.unicef.org/nigeria/", detail: "UNICEF reports that 1 in 4 Nigerian children under 5 is stunted due to chronic malnutrition. Stunting causes irreversible damage to brain development, permanently reducing cognitive capacity, educational outcomes, and lifetime economic potential." },
  { id: 71, category: "HEALTH", stat: "CHOLERA", label: "Major cholera outbreak across 30+ states in 2024", source: "NCDC 2024", sourceUrl: "https://ncdc.gov.ng/", detail: "A major cholera outbreak swept across 30+ Nigerian states in 2024, driven by the absence of clean water, broken sanitation systems, and collapsed public health infrastructure. Cholera is entirely preventable — its return is a governance failure, not a natural disaster." },
  { id: 72, category: "HEALTH", stat: "700+", label: "Deaths from cholera outbreak in 2024", source: "NCDC Nigeria", sourceUrl: "https://ncdc.gov.ng/", detail: "The 2024 cholera outbreak killed over 700 Nigerians and infected tens of thousands, according to NCDC data. Communities without clean water and functioning sewage systems remain permanently vulnerable to outbreaks that should not exist in 2024." },
  { id: 73, category: "HEALTH", stat: "~2M", label: "People living with HIV in Nigeria (order of magnitude)", source: "NACA / UNAIDS estimates", sourceUrl: "https://www.naca.gov.ng/", detail: "UNAIDS/NACA estimates place people living with HIV in Nigeria around ~1.8–2.1 million in recent years — among the world's largest absolute burdens — not 4.5 million. Treatment access and funding shocks (including external aid volatility) still put lives at risk." },
  { id: 74, category: "HEALTH", stat: "UNAFFORDABLE", label: "85% of Nigerians pay healthcare fully out-of-pocket", source: "NHIS Data 2024", sourceUrl: "https://www.nhia.gov.ng/", detail: "85% of Nigerians pay for every medical visit, test, and drug entirely out-of-pocket. The National Health Insurance Authority covers less than 5% of the population. Most Nigerians simply go without necessary care when they cannot pay — a death sentence for millions." },

  // EDUCATION
  { id: 75, category: "EDUCATION", stat: "20 MILLION", label: "Out-of-school children in Nigeria, highest globally", source: "UNICEF Nigeria 2024", sourceUrl: "https://www.unicef.org/nigeria/", detail: "Nigeria has over 20 million out-of-school children — more than any other country in the world. This includes millions displaced by conflict, girls pulled out for early marriage, and children whose families cannot afford school fees and uniforms." },
  { id: 76, category: "EDUCATION", stat: "1ST GLOBALLY", label: "Nigeria leads world in out-of-school children", source: "UNESCO 2024", sourceUrl: "https://www.unesco.org/", detail: "UNESCO's 2024 Global Education Report confirms Nigeria leads the world in out-of-school children for the second consecutive year. This represents a national emergency that will scar Nigeria's workforce, productivity, and democratic capacity for generations." },
  { id: 77, category: "EDUCATION", stat: "2 WEEKS", label: "Only nationwide ASUU action under Tinubu: Oct 2025 warning strike", source: "Premium Times / Punch / Channels Oct 2025", sourceUrl: "https://www.premiumtimesng.com/news/headlines/827457-updated-asuu-to-begin-two-week-strike-on-monday.html", detail: "There has been no multi-month nationwide indefinite ASUU strike under Tinubu. The last long shutdown was Feb–Oct 2022 under Buhari (~8 months). Under Tinubu, ASUU ran a total two-week nationwide warning strike from 13 Oct 2025 (suspended ~22 Oct). Local chapter strikes and ongoing 2009-agreement disputes continue — but '8 months under BAT' is false." },
  { id: 78, category: "EDUCATION", stat: "₦1.5 TRILLION", label: "Education budget vs ₦8T+ debt service", source: "Federal Budget 2024", sourceUrl: "https://www.budgetoffice.gov.ng/", detail: "The federal education budget stands at ₦1.5 trillion — less than 6% of the national budget and far below UNESCO's recommended 15-20%. The cruel comparison: Nigeria spends over ₦8 trillion annually servicing debts while spending ₦1.5 trillion educating 220 million people." },
  { id: 79, category: "EDUCATION", stat: "65%", label: "Federal universities lacking basic infrastructure", source: "NUC Audit 2023", sourceUrl: "https://www.nuc.edu.ng/", detail: "The National Universities Commission's audit found 65% of Nigerian federal universities lack functional laboratories, modern libraries, adequate hostels, and lecture halls. Students are paying higher fees — thanks to Tinubu's STUDENTLOAN Act — for a worsening experience." },
  { id: 80, category: "EDUCATION", stat: "JAPA WAVE", label: "Record youth emigration driven by education system collapse", source: "NBS 2024", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "Record numbers of Nigerian graduates emigrate immediately after obtaining their degrees — locally called 'Japa' (to flee in Yoruba). Nigeria's education system is effectively producing graduates for other countries' economies while domestic opportunities collapse." },
  { id: 81, category: "EDUCATION", stat: "2,000+", label: "Schools destroyed or closed in conflict zones", source: "UBEC 2024", sourceUrl: "https://ubec.gov.ng/", detail: "The Universal Basic Education Commission documented over 2,000 schools destroyed or permanently closed in conflict-affected areas of Northern Nigeria. Entire generations of children in Borno, Zamfara, and other states have grown up without formal education." },
  { id: 82, category: "EDUCATION", stat: "58%", label: "Adult literacy rate, one of lowest in West Africa", source: "UNESCO Nigeria", sourceUrl: "https://www.unesco.org/", detail: "Nigeria's adult literacy rate stands at just 58% — one of the lowest in West Africa. Low literacy perpetuates cycles of poverty, limits economic participation, enables manipulation by politicians, and undermines the quality of democratic participation." },

  // HUNGER
  { id: 83, category: "HUNGER", stat: "26.5 MILLION", label: "Nigerians acutely food insecure in 2024", source: "WFP / FEWSNET 2024", sourceUrl: "https://www.wfp.org/countries/nigeria", detail: "WFP and FEWSNET estimate 26.5 million Nigerians face acute food insecurity in 2024 — meaning they lack reliable access to sufficient, safe, and nutritious food for an active, healthy life. This number has grown steadily since Tinubu's policies took effect." },
  { id: 84, category: "HUNGER", stat: "CRISIS", label: "IPC Phase 3-4 food crisis in 26 Nigerian states", source: "IPC Analysis 2024", sourceUrl: "https://www.ipcinfo.org/", detail: "The Integrated Food Security Phase Classification placed 26 of Nigeria's 36 states at IPC Phase 3 (Crisis) or Phase 4 (Emergency). Phase 4 means people are experiencing food consumption gaps leading to high acute malnutrition and excess mortality." },
  { id: 85, category: "HUNGER", stat: "400%", label: "Price increase for garri, yam, and beans since 2023", source: "NBS Market Data", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "Prices of staple foods — garri, yam, and beans — have risen by up to 400% since 2023. Garri, historically Nigeria's cheapest food and a last resort for the poor, is now unaffordable for millions who relied on it as their primary source of carbohydrate." },
  { id: 86, category: "HUNGER", stat: "7 MILLION", label: "Children suffering from acute malnutrition", source: "UNICEF Nigeria 2024", sourceUrl: "https://www.unicef.org/nigeria/", detail: "UNICEF estimates 7 million Nigerian children suffer from acute malnutrition. Severe acute malnutrition is fatal without treatment. Nigeria's therapeutic feeding centres are overwhelmed, understaffed, and underfunded — many children die before reaching care." },
  { id: 87, category: "HUNGER", stat: "₦1,200", label: "Current cost of 1kg of rice vs ₦350 in 2022", source: "NBS Market Survey", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "A 1kg bag of rice now costs approximately ₦1,200, compared to ₦350 in 2022 — a 240% price increase in two years. Rice is Nigeria's most consumed staple food; this surge has pushed tens of millions who could previously afford rice into hunger." },
  { id: 88, category: "HUNGER", stat: "STARVATION", label: "Families in Borno and Zamfara facing near-famine", source: "UN OCHA 2024", sourceUrl: "https://www.unocha.org/nigeria", detail: "UN OCHA raised alarms about near-famine conditions in parts of Borno and Zamfara states, where armed conflict prevents farming, restricts aid delivery, and shuts down markets. Some isolated communities face starvation-level food shortages with no government response." },
  { id: 89, category: "HUNGER", stat: "40%", label: "Increase in food prices in first 6 months of Tinubu", source: "NBS 2023", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "In just the first six months of Tinubu's administration, food prices rose 40% as the twin shocks of fuel subsidy removal and currency devaluation rippled through the entire food supply chain. This was the fastest food price shock in Nigeria's peacetime history." },
  { id: 90, category: "HUNGER", stat: "3 IN 4", label: "Low-income Nigerians skipping meals regularly", source: "NOI Polls 2024", sourceUrl: "https://noi-polls.com/", detail: "NOI Polls found that 3 out of 4 low-income Nigerians regularly skip meals in 2024. Families have reduced meal frequency from 3 to 1 per day. Children are going to school hungry. This level of food deprivation in peacetime is a moral catastrophe." },

  // ENERGY
  { id: 91, category: "ENERGY", stat: "₦1,030", label: "Petrol pump price per litre as of 2024", source: "NNPCL 2024", sourceUrl: "https://nnpcgroup.com/", detail: "Petrol reached ₦1,030 per litre in 2024, up from ₦185 before subsidy removal. Transport costs have multiplied, food distribution has become more expensive, and generators — already running on costly diesel — are now unaffordable for many homes and small businesses." },
  { id: 92, category: "ENERGY", stat: "4,000 MW", label: "Average power generation for 220 million people", source: "NERC 2024", sourceUrl: "https://nerc.gov.ng/", detail: "Nigeria generates an average of just 4,000 megawatts of electricity for 220 million people. The United Kingdom, with a third of Nigeria's population, generates over 60,000 MW. This catastrophic energy deficit makes Nigeria uncompetitive in every sector." },
  { id: 93, category: "ENERGY", stat: "20 HOURS", label: "Average daily blackout duration across Nigeria", source: "NERC Data", sourceUrl: "https://nerc.gov.ng/", detail: "Nigerians experience an average of 20 hours of power outage daily. This invisible tax — paid in diesel and generator costs — adds ₦50,000-₦200,000 per month to household and business expenses. It is the single biggest constraint on Nigerian economic growth." },
  { id: 94, category: "ENERGY", stat: "₦225 BILLION", label: "Electricity sector losses monthly due to infrastructure failure", source: "NERC 2024", sourceUrl: "https://nerc.gov.ng/", detail: "The electricity sector loses approximately ₦225 billion monthly through technical losses, unpaid bills, meter fraud, and infrastructure decay. These losses are passed directly to consumers through higher tariffs — Nigerians pay more for less electricity every year." },
  { id: 95, category: "ENERGY", stat: "~230%", label: "Band A tariff ₦68→₦225/kWh April 2024", source: "NERC Order April 2024", sourceUrl: "https://nerc.gov.ng/", detail: "NERC raised Band A tariffs from ₦68/kWh to ₦225/kWh effective April 2024 — about a 230% increase (~3× old rate), not 800%. Rates were later adjusted (e.g. toward ~₦206–209/kWh). Bills still exploded for many businesses and households on higher service bands." },
  { id: 96, category: "ENERGY", stat: "REFINERY FAILS", label: "Dangote refinery launched but petrol still expensive", source: "NNPCL / Media 2024", sourceUrl: "https://nnpcgroup.com/", detail: "The Dangote Refinery launched in 2024 with government fanfare, but disputes between NNPCL and the refinery over crude oil pricing and distribution prevented Nigerians from benefiting. Petrol prices remained at near-record highs throughout the year." },
  { id: 97, category: "ENERGY", stat: "31 YEARS", label: "Port Harcourt refinery out of commission before Tinubu", source: "NNPCL Records", sourceUrl: "https://nnpcgroup.com/", detail: "The Port Harcourt Refinery was essentially out of commission for 31 years before Tinubu took office. Despite hundreds of billions spent on 'rehabilitation' projects across multiple administrations, Nigerian refineries have never reliably produced fuel for domestic use." },
  { id: 98, category: "ENERGY", stat: "ZERO", label: "New power plants commissioned under Tinubu administration", source: "NERC 2024", sourceUrl: "https://nerc.gov.ng/", detail: "Not a single new power plant has been commissioned under the Tinubu administration. While power sector reforms were promised and tariffs were raised, electricity generation remains stagnant. The power crisis that has plagued Nigeria for 30 years continues unaddressed." },

  // YOUTH
  { id: 99, category: "YOUTH", stat: "1.3 MILLION", label: "Nigerians who emigrated in 2023 alone", source: "NPC / NBS Data", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "Over 1.3 million Nigerians emigrated in 2023 alone — Nigeria's highest-ever single-year emigration figure. Doctors, engineers, lawyers, nurses, and tech workers are leaving in unprecedented numbers, hollowing out every profession and sector Nigeria needs most." },
  { id: 100, category: "YOUTH", stat: "JAPA NATION", label: "Nigeria now among top sources of UK and Canada migrants", source: "UK Home Office 2024", sourceUrl: "https://www.gov.uk/government/collections/immigration-statistics", detail: "Nigeria is now among the top three source countries for immigration to the UK and Canada. UK Home Office data shows Nigerian visa applications tripled since 2021, with healthcare workers, students, and skilled professionals leading the surge." },
  { id: 101, category: "YOUTH", stat: "60%", label: "Nigerian youths who want to leave Nigeria permanently", source: "Afrobarometer 2024", sourceUrl: "https://www.afrobarometer.org/country/nigeria/", detail: "Afrobarometer's 2024 survey found 60% of Nigerian youth want to permanently leave the country. This is a damning vote of no confidence in Nigeria's future by the very generation that should be building it — and a crisis the government has no credible plan to address." },
  { id: 102, category: "YOUTH", stat: "6.5%+", label: "Youth unemployment higher than adult rate (NBS NLFS)", source: "NBS Labour Force Survey 2024", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "Under the current NBS ILO-aligned survey, overall unemployment is low single digits (e.g. 5.3% Q1 2024; 4.3% Q2 2024), with youth rates higher than adults (NBS has reported youth unemployment around mid-single digits, e.g. ~6.5% in some 2024 releases) — not 53%. The real crisis is underemployment, informal poverty wages, and graduates without quality jobs." },
  { id: 103, category: "YOUTH", stat: "#ENDSARS", label: "Tinubu linked to Lagos crackdown on protesters, Oct 2020", source: "Lagos Judicial Panel", sourceUrl: "https://www.lagosstate.gov.ng/", detail: "The Lagos State Judicial Panel of Inquiry linked the state government — under Tinubu's political machinery as Lagos godfather — to decisions during the October 2020 #EndSARS protests. These decisions resulted in the deployment of soldiers who shot at peaceful protesters." },
  { id: 104, category: "YOUTH", stat: "12+", label: "Protesters killed at Lekki Toll Gate on Oct 20, 2020", source: "Lagos Judicial Panel", sourceUrl: "https://www.lagosstate.gov.ng/", detail: "The Lagos State Judicial Panel of Inquiry found that at least 12 protesters were killed at Lekki Toll Gate on October 20, 2020, when soldiers fired on peaceful demonstrators. The panel recommended prosecutions. To date, no soldier or official has been held accountable." },
  { id: 105, category: "YOUTH", stat: "ARRESTED", label: "Journalists and protesters jailed for online criticism in 2024", source: "RSF / Amnesty International 2024", sourceUrl: "https://rsf.org/en/country/nigeria", detail: "Reporters Without Borders and Amnesty International documented multiple arrests of journalists and social media users in 2024 for posts criticising the government. Nigeria's Cybercrime Act has become the primary tool for suppressing free expression online." },
  { id: 106, category: "YOUTH", stat: "AUG 2024", label: "August 2024 protests met with live ammunition", source: "Amnesty International", sourceUrl: "https://www.amnesty.org/en/countries/africa/nigeria/", detail: "During nationwide August 2024 protests against poverty and bad governance, security forces were deployed with live ammunition in multiple states. Amnesty International documented credible evidence of extrajudicial killings — peaceful protesters shot dead on Nigerian streets." },
  { id: 107, category: "YOUTH", stat: "22 KILLED", label: "Protesters killed during August 2024 demonstrations", source: "Amnesty International", sourceUrl: "https://www.amnesty.org/en/countries/africa/nigeria/", detail: "Amnesty International confirmed at least 22 protesters were killed by security forces during the August 2024 anti-government demonstrations. The killings drew international condemnation. No security personnel have been prosecuted for the deaths." },
  { id: 108, category: "YOUTH", stat: "1,000+ HELD", label: "Over 1,000 protesters detained in August 2024", source: "NHRC Nigeria / Amnesty International", sourceUrl: "https://www.amnesty.org/en/countries/africa/nigeria/", detail: "Over 1,000 protesters were detained by security forces during and after August 2024 demonstrations. Many were held beyond legal limits without charge. Reports emerged of physical abuse and torture in detention, documented by the National Human Rights Commission and Amnesty." },

  // AGRICULTURE
  { id: 109, category: "AGRICULTURE", stat: "₦35,000/BAG", label: "Price of fertilizer, making farming unviable for smallholders", source: "FMARD 2024", sourceUrl: "https://www.fmard.gov.ng/", detail: "A 50kg bag of fertilizer now costs ₦35,000, up from approximately ₦5,000 before subsidy removal and currency devaluation. Smallholder farmers — who produce 80% of Nigeria's food — cannot afford inputs, leading to lower yields, higher food prices, and abandoned farmland." },
  { id: 110, category: "AGRICULTURE", stat: "70%", label: "Farmlands abandoned in North due to insecurity", source: "FAO Nigeria 2024", sourceUrl: "https://www.fao.org/nigeria/", detail: "FAO estimates 70% of farmlands in Northern Nigeria have been abandoned due to banditry, herder-farmer conflict, and general insecurity. Farmers cannot risk their lives to plant or harvest. This mass abandonment of agricultural land directly causes Nigeria's food crisis." },
  { id: 111, category: "AGRICULTURE", stat: "₦30 BILLION", label: "Agriculture budget, less than 1% of national budget", source: "Federal Budget 2024", sourceUrl: "https://www.budgetoffice.gov.ng/", detail: "Nigeria's agriculture budget stands at a meagre ₦30 billion — less than 1% of total national spending. For a country where agriculture employs 35% of the workforce and 70%+ live in rural areas, this allocation signals a deliberate abandonment of Nigeria's food future." },
  { id: 112, category: "AGRICULTURE", stat: "FOOD IMPORT", label: "Nigeria now imports staples it used to export", source: "FMARD / CBN Data", sourceUrl: "https://www.fmard.gov.ng/", detail: "Nigeria now imports rice, wheat, sugar, and tomato paste at massive scale — staples it once produced or exported. The CBN spends billions of dollars annually on food imports, draining foreign exchange reserves while domestic farmers go bankrupt or are killed." },

  // JUSTICE
  { id: 113, category: "JUSTICE", stat: "MANIPULATED", label: "INEC servers allegedly manipulated during 2023 election", source: "PDP / LP Court Filings", sourceUrl: "https://www.supremecourt.gov.ng/", detail: "Opposition parties PDP and Labour Party filed detailed court petitions alleging that INEC's election management system (IReV) was manipulated to alter results during the 2023 presidential election. The Supreme Court dismissed the petitions primarily on procedural grounds without addressing the substance." },
  { id: 114, category: "JUSTICE", stat: "DISMISSED", label: "Supreme Court dismissed Obi and Atiku petitions on technicality", source: "Supreme Court 2023", sourceUrl: "https://www.supremecourt.gov.ng/", detail: "The Supreme Court dismissed presidential election petitions by Atiku Abubakar and Peter Obi in 2023. Legal observers and civil society groups argued the court avoided ruling on substantive electoral fraud allegations by dismissing on procedural technicalities, denying Nigerians justice." },
  { id: 115, category: "JUSTICE", stat: "JUDICIARY", label: "Concerns about executive pressure on Nigerian courts", source: "NBA Nigeria / NHRC", sourceUrl: "https://nigerianbar.org.ng/", detail: "The Nigerian Bar Association and civil society groups have raised documented concerns about executive pressure on the judiciary. Multiple controversial rulings in the government's favour — on electoral matters, asset forfeiture, and detentions — have fuelled deep public distrust in Nigeria's courts." },
  { id: 116, category: "JUSTICE", stat: "BINANCE CEO", label: "Tigran Gambaryan held without trial for months in 2024", source: "Reuters / BBC 2024", sourceUrl: "https://www.reuters.com/", detail: "Tigran Gambaryan, a US citizen and Binance executive, was detained in Nigeria for months without a fair trial in 2024. His detention drew international condemnation from the US government and media. It was widely seen as an abuse of Nigeria's legal process for economic leverage." },
  { id: 117, category: "JUSTICE", stat: "PRESS FREEDOM", label: "Nigeria dropped 6 places in press freedom index 2024", source: "RSF Index 2024", sourceUrl: "https://rsf.org/en/country/nigeria", detail: "Nigeria dropped 6 places in the 2024 RSF World Press Freedom Index. Journalists face harassment, arbitrary detention, and violence. Multiple reporters who covered the August 2024 protests or investigated government corruption were arrested under the Cybercrime Act." },
  { id: 118, category: "JUSTICE", stat: "DETAINED", label: "Critics and opposition figures facing arbitrary detention", source: "Amnesty International 2024", sourceUrl: "https://www.amnesty.org/en/countries/africa/nigeria/", detail: "Amnesty International documented multiple cases of opposition politicians, activists, and online critics subjected to arbitrary detention and manufactured criminal charges under Tinubu. Nigeria's security agencies have become instruments of political intimidation." },
  { id: 119, category: "JUSTICE", stat: "IMPUNITY", label: "No accountability for Lekki Toll Gate shootings", source: "Lagos Judicial Panel", sourceUrl: "https://www.lagosstate.gov.ng/", detail: "Despite the Lagos Judicial Panel recommending prosecution of those responsible for the Lekki Toll Gate shootings in October 2020, no soldiers, officers, or government officials have been charged, tried, or convicted. The culture of impunity that killed protesters continues." },
  { id: 120, category: "JUSTICE", stat: "CYBER LAW", label: "Social media users arrested under cybercrime act for criticism", source: "RSF / CPJ 2024", sourceUrl: "https://rsf.org/en/country/nigeria", detail: "Nigeria's Cybercrime Act has been systematically weaponised against social media users, bloggers, and journalists for posts criticising government policies. The Committee to Protect Journalists and RSF documented a sharp rise in such arrests under Tinubu, creating a chilling effect on free speech." },

  // SUPPLEMENTARY
  { id: 121, category: "DEBT", stat: "₦28 TRILLION", label: "Federal government revenue in 2024, dwarfed by debt", source: "FIRS / Budget Office", sourceUrl: "https://www.firs.gov.ng/", detail: "Federal government revenue in 2024 totalled approximately ₦28 trillion — dwarfed by debt obligations alone. Nigeria collects among the lowest taxes as a percentage of GDP anywhere in Africa, leaving government structurally unable to fund basic services." },
  { id: 122, category: "ECONOMY", stat: "70%", label: "Cost of living increase in Lagos in one year", source: "NOI Polls 2024", sourceUrl: "https://noi-polls.com/", detail: "NOI Polls documented a 70% increase in the cost of living in Lagos within a single year of Tinubu's policies taking effect. Rent, transport, food, and utilities all surged simultaneously, devastating household budgets from the poorest to the middle class." },
  { id: 123, category: "INSECURITY", stat: "BORNO", label: "Northeast still under Boko Haram/ISWAP daily attacks", source: "ACLED Q3 2024", sourceUrl: "https://acleddata.com/", detail: "ACLED data for Q3 2024 shows the Northeast — particularly Borno State — continues to face near-daily Boko Haram and ISWAP attacks. Over 14 years since the insurgency began, with hundreds of billions spent on security, there is still no credible end in sight." },
  { id: 124, category: "GOVERNANCE", stat: "ABSENCE", label: "Tinubu attended G7 but missed key national security meetings", source: "State House Logs", sourceUrl: "https://www.statehouse.gov.ng/", detail: "Tinubu attended the G7 summit and multiple international conferences while missing critical National Security Council meetings during periods of mass killings and protests at home. His travel pattern consistently prioritises international optics over domestic governance." },
  { id: 125, category: "EDUCATION", stat: "300%", label: "WAEC and JAMB fee increases under Tinubu", source: "WAEC / JAMB 2024", sourceUrl: "https://www.waecnigeria.org/", detail: "Examination fees for WAEC and JAMB — the gateway to secondary and tertiary education — rose by over 300% under Tinubu. Millions of low-income students can no longer afford to sit for exams that determine their future, effectively barring the poor from educational advancement." },
  { id: 126, category: "HEALTH", stat: "STRIKE", label: "Resident doctors went on strike over unpaid salaries 2024", source: "NARD 2024", sourceUrl: "https://www.nard.ng/", detail: "Nigeria's resident doctors went on strike in 2024 over months of unpaid salaries and hazard allowances the government had promised. Hospitals were left without their most critical frontline doctors, directly endangering patients and adding to Nigeria's ongoing healthcare catastrophe." },
  { id: 127, category: "ENERGY", stat: "₦500 BILLION", label: "Lost to electricity sector inefficiency annually", source: "USAID Nigeria Energy", sourceUrl: "https://www.usaid.gov/nigeria", detail: "USAID estimates Nigeria loses ₦500 billion annually to electricity sector inefficiency — comprising non-cost-reflective tariffs, transmission losses, meter fraud, and distribution theft. These losses depress investment in new capacity and are ultimately borne by consumers and businesses." },
  { id: 128, category: "JUSTICE", stat: "GAGGED", label: "NTA and Channels forced to edit protest coverage", source: "NUJ Records 2024", sourceUrl: "https://www.nujng.com/", detail: "The Nigerian Union of Journalists documented cases where state broadcaster NTA and private station Channels TV were pressured to edit or suppress live coverage of the August 2024 protests. This constitutes state interference in broadcast media and a suppression of Nigerians' right to information." },
  { id: 129, category: "HUNGER", stat: "₦800", label: "Cost of 1kg of tomatoes, up from ₦200 in 2022", source: "NBS Market Data", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "A kilogram of tomatoes now costs ₦800, up from ₦200 in 2022 — a 300% price increase in two years. Tomatoes are a base ingredient in virtually every Nigerian meal. This price surge illustrates the collapse of agricultural supply chains and rural production capacity." },
  { id: 130, category: "AGRICULTURE", stat: "OPEN GRAZING", label: "Herder-farmer crisis unresolved, worsening under BAT", source: "ACLED 2024", sourceUrl: "https://acleddata.com/", detail: "The herder-farmer crisis — driven by competition for land and water resources — remains completely unresolved under Tinubu. ACLED data shows violence has intensified in the Middle Belt, destroying livelihoods, displacing farming communities, and contributing to the national food emergency." },
  { id: 131, category: "DEBT", stat: "MULTI-BN $", label: "External debt service drains FX every year", source: "DMO external debt service tables", sourceUrl: "https://www.dmo.gov.ng/debt-profile/external-debts/debt-service", detail: "DMO publishes quarterly/annual external debt service in dollars. Service is multi-billion USD annually (not a fixed ₦1.08 trillion every month). FX outflows for interest and principal still compete with imports and reserves — a structural pressure on the naira." },
  { id: 132, category: "ECONOMY", stat: "NAIRA CRASH", label: "Naira lost 70% of value within Tinubu's first 12 months", source: "CBN Exchange Rate Data", sourceUrl: "https://www.cbn.gov.ng/", detail: "The naira lost approximately 70% of its value against the dollar within Tinubu's first 12 months — the fastest currency collapse in Nigeria's modern history. Import costs, foreign debt burdens, and the price of every product with a foreign input component all exploded simultaneously." },
  { id: 133, category: "INSECURITY", stat: "ZAMFARA", label: "Entire LGAs under bandit control in Northwest Nigeria", source: "HRW 2024", sourceUrl: "https://www.hrw.org/africa/nigeria", detail: "Human Rights Watch documented entire Local Government Areas in Zamfara State under effective bandit control in 2024. Government presence has collapsed. Residents pay 'taxes' to bandits, cannot farm without permission, and live under a parallel authority more powerful than the Nigerian state." },
  { id: 134, category: "GOVERNANCE", stat: "NEPOTISM", label: "Tinubu's allies dominate parastatals and agencies", source: "The Cable 2024", sourceUrl: "https://www.thecable.ng/", detail: "Investigative reporting by The Cable confirmed Tinubu's political allies, in-laws, and associates dominate federal agencies, parastatals, and boards across government. Merit-based appointment has been entirely supplanted by political loyalty and ethnic calculation." },
  { id: 135, category: "YOUTH", stat: "HUSTLE POVERTY", label: "Average Nigerian youth earns below $2 per day equivalent", source: "NBS 2024", sourceUrl: "https://www.nigerianstat.gov.ng/", detail: "Despite the culture of working multiple jobs and 'side hustles,' the average Nigerian youth earns below the equivalent of $2 per day in real terms. Long hours of informal work yield poverty wages. The hustle is real — the reward is not." },
  { id: 136, category: "HEALTH", stat: "90%", label: "Hospitals reporting shortage of essential medications", source: "FMOH 2024", sourceUrl: "https://www.health.gov.ng/", detail: "90% of Nigerian hospitals report chronic shortages of essential medications, according to the Federal Ministry of Health. Drug shortages have become normalised. Patients are routinely told to buy medicines from private pharmacies at 800% inflated prices — or go without." },
  { id: 137, category: "ENERGY", stat: "GRID COLLAPSE", label: "National grid collapsed multiple times in 2024", source: "TCN Nigeria 2024", sourceUrl: "https://www.tcn.org.ng/", detail: "Nigeria's national electricity grid suffered multiple total collapses in 2024, plunging the entire country into complete darkness simultaneously. Each collapse disrupts hospitals, water systems, telecom infrastructure, and businesses. The frequency of collapses has increased, not decreased, under Tinubu." },
  { id: 138, category: "JUSTICE", stat: "BAIL DENIED", label: "Protesters held beyond legal detention limits in 2024", source: "NBA / Amnesty International 2024", sourceUrl: "https://nigerianbar.org.ng/", detail: "The Nigerian Bar Association and Amnesty International documented August 2024 protesters held beyond the constitutional 24-48 hour limit without charge. Courts were slow to grant bail applications. Reports of physical abuse in detention were documented by human rights monitors." },
  { id: 139, category: "HUNGER", stat: "KWASHIORKOR", label: "Kwashiorkor cases rising in northern states 2024", source: "UNICEF Nigeria", sourceUrl: "https://www.unicef.org/nigeria/", detail: "UNICEF has reported rising cases of kwashiorkor — severe protein-energy malnutrition associated with famine — in northern Nigerian states in 2024. Kwashiorkor causes irreversible damage to developing children. Its return in 2024 signals a catastrophic nutrition collapse." },
  { id: 140, category: "DEBT", stat: "₦6.2 TRILLION", label: "Supplementary budget added to already-record 2024 deficit", source: "NASS Records", sourceUrl: "https://www.nassnigeria.gov.ng/", detail: "A ₦6.2 trillion supplementary budget was added to the already record-breaking 2024 deficit. This additional allocation bypassed normal budget scrutiny. With debt service consuming most revenue, every supplementary budget is effectively borrowed money placed on the backs of future Nigerians." },
];

const generateAllCards = () => {
  const cards = [];
  const templates = [
    (d) => ({ ...d, variant: "stat" }),
    (d) => ({ ...d, variant: "question", question: `Why is ${d.stat} acceptable?` }),
    (d) => ({ ...d, variant: "demand", demand: "NIGERIANS DESERVE BETTER" }),
    (d) => ({ ...d, variant: "compare", compare: "Same period. Same country. Zero improvement." }),
    (d) => ({ ...d, variant: "call", call: "VOTE. PROTECT YOUR VOTE. SHARE THIS." }),
    (d) => ({ ...d, variant: "stark" }),
    (d) => ({ ...d, variant: "minimal" }),
  ];

  let cardId = 0;
  for (let i = 0; cardId < 1000; i++) {
    const baseCard = CARD_DATA[i % CARD_DATA.length];
    const template = templates[Math.floor(i / CARD_DATA.length) % templates.length];
    cards.push({ ...template(baseCard), uid: cardId + 1 });
    cardId++;
  }
  return cards;
};

const ALL_CARDS = generateAllCards();

const CATEGORIES = ["ALL", "DEBT", "ECONOMY", "INSECURITY", "GOVERNANCE", "HEALTH", "EDUCATION", "HUNGER", "ENERGY", "YOUTH", "AGRICULTURE", "JUSTICE"];

const CATEGORY_COLORS = {
  DEBT: { bg: "#1a0a00", accent: "#FF4500", text: "#FF6B35" },
  ECONOMY: { bg: "#0a0a1a", accent: "#FFD700", text: "#FFC107" },
  INSECURITY: { bg: "#1a0000", accent: "#FF0000", text: "#FF4444" },
  GOVERNANCE: { bg: "#0a001a", accent: "#8B00FF", text: "#B44FFF" },
  HEALTH: { bg: "#001a0a", accent: "#00FF88", text: "#00CC6A" },
  EDUCATION: { bg: "#001a1a", accent: "#00FFFF", text: "#00CCCC" },
  HUNGER: { bg: "#1a1a00", accent: "#FF8C00", text: "#FFA500" },
  ENERGY: { bg: "#0a0a00", accent: "#FFFF00", text: "#E8FF5A" },
  YOUTH: { bg: "#00001a", accent: "#4488FF", text: "#6699FF" },
  AGRICULTURE: { bg: "#001a00", accent: "#44FF44", text: "#33CC33" },
  JUSTICE: { bg: "#1a0a0a", accent: "#FF6688", text: "#FF4466" },
};

const getCardStyle = (category) => CATEGORY_COLORS[category] || { bg: "#111", accent: "#FF4500", text: "#FF6B35" };

const drawAndDownloadCard = (card) => {
  const style = getCardStyle(card.category);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = style.bg;
  ctx.fillRect(0, 0, 1080, 1080);

  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 1080;
    const y = Math.random() * 1080;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.015})`;
    ctx.fillRect(x, y, 1, 1);
  }

  ctx.fillStyle = style.accent;
  ctx.fillRect(0, 0, 1080, 6);

  ctx.fillStyle = style.accent;
  ctx.font = "bold 28px 'Space Mono', monospace";
  ctx.fillText(`[ ${card.category} ]`, 60, 90);

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "bold 20px 'Space Mono', monospace";
  ctx.fillText("CONCERNED NIGERIAN", 60, 130);

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "bold 22px 'Space Mono', monospace";
  ctx.textAlign = "right";
  ctx.fillText(`#${String(card.uid).padStart(4, "0")}`, 1020, 90);
  ctx.textAlign = "left";

  ctx.fillStyle = style.text;
  const statText = card.stat;
  const fontSize = statText.length > 10 ? Math.max(60, 120 - (statText.length - 10) * 4) : 120;
  ctx.font = `bold ${fontSize}px 'Space Mono', monospace`;
  ctx.fillText(statText, 60, 380);

  ctx.fillStyle = style.accent;
  ctx.fillRect(60, 420, 960, 3);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 44px 'Plus Jakarta Sans', sans-serif";
  const words = card.label.split(" ");
  let line = "";
  let y = 510;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > 950 && line !== "") {
      ctx.fillText(line, 60, y);
      line = word + " ";
      y += 60;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, 60, y);

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "22px 'Space Mono', monospace";
  ctx.fillText(`SOURCE: ${card.source}`, 60, 900);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "18px 'Space Mono', monospace";
  ctx.fillText(card.sourceUrl, 60, 930);

  ctx.fillStyle = style.accent;
  ctx.fillRect(0, 1050, 1080, 30);

  ctx.fillStyle = "#000";
  ctx.font = "bold 18px 'Space Mono', monospace";
  ctx.fillText("NIGERIA DESERVES BETTER — concernednigerian.com", 240, 1072);

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cn-${String(card.uid).padStart(4, "0")}-${card.category.toLowerCase()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
};

function CardComponent({ card, onView, onRead, onDownload }) {
  const style = getCardStyle(card.category);

  return (
    <div style={{
      background: style.bg,
      border: `2px solid ${style.accent}22`,
      borderTop: `4px solid ${style.accent}`,
      padding: "18px",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.2s ease",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = style.accent; e.currentTarget.style.borderTopColor = style.accent; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${style.accent}22`; e.currentTarget.style.borderTopColor = style.accent; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <span style={{ color: style.accent, fontFamily: "monospace", fontSize: "10px", fontWeight: "bold", letterSpacing: "2px" }}>
          [{card.category}]
        </span>
        <span style={{ color: "rgba(255,255,255,0.25)", fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px" }}>
          #{String(card.uid).padStart(4, "0")}
        </span>
      </div>

      <div style={{
        color: style.text,
        fontFamily: "monospace",
        fontWeight: "900",
        fontSize: card.stat.length > 12 ? "16px" : "26px",
        lineHeight: 1.1,
        marginBottom: "8px",
        letterSpacing: "-0.5px",
        flex: 1,
      }}>
        {card.stat}
      </div>

      <div style={{ width: "32px", height: "2px", background: style.accent, marginBottom: "8px" }} />

      <div style={{ color: "#fff", fontSize: "11px", lineHeight: "1.5", marginBottom: "8px", fontWeight: "500", flex: 2 }}>
        {card.label}
      </div>

      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", fontFamily: "monospace", letterSpacing: "0.5px", marginBottom: "12px" }}>
        {card.source}
      </div>

      {/* Three action buttons */}
      <div style={{ display: "flex", gap: "6px" }}>
        <button
          onClick={() => onView(card)}
          style={{
            flex: 1,
            background: "transparent",
            border: `1px solid ${style.accent}55`,
            color: style.accent,
            padding: "5px 4px",
            fontFamily: "monospace",
            fontSize: "9px",
            fontWeight: "bold",
            cursor: "pointer",
            letterSpacing: "1px",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = style.accent; e.currentTarget.style.color = "#000"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = style.accent; }}
        >
          VIEW
        </button>
        <button
          onClick={() => onRead(card)}
          style={{
            flex: 1,
            background: "transparent",
            border: `1px solid ${style.accent}55`,
            color: style.accent,
            padding: "5px 4px",
            fontFamily: "monospace",
            fontSize: "9px",
            fontWeight: "bold",
            cursor: "pointer",
            letterSpacing: "1px",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = style.accent; e.currentTarget.style.color = "#000"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = style.accent; }}
        >
          READ
        </button>
        <button
          onClick={() => onDownload(card)}
          style={{
            flex: 1,
            background: "transparent",
            border: `1px solid ${style.accent}55`,
            color: style.accent,
            padding: "5px 4px",
            fontFamily: "monospace",
            fontSize: "9px",
            fontWeight: "bold",
            cursor: "pointer",
            letterSpacing: "1px",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = style.accent; e.currentTarget.style.color = "#000"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = style.accent; }}
        >
          DOWNLOAD
        </button>
      </div>
    </div>
  );
}

function ReadPanel({ card, onClose }) {
  const style = getCardStyle(card.category);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 900,
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "min(480px, 92vw)",
        background: "#0d0d0d",
        borderLeft: `3px solid ${style.accent}`,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        animation: "slideIn 0.25s ease",
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

        {/* Panel header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: `1px solid ${style.accent}33`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: style.bg,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}>
          <span style={{ color: style.accent, fontFamily: "monospace", fontSize: "11px", fontWeight: "bold", letterSpacing: "2px" }}>
            [{card.category}] #{String(card.uid).padStart(4, "0")}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${style.accent}55`,
              color: style.accent,
              width: "32px",
              height: "32px",
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Panel body */}
        <div style={{ padding: "28px 24px", flex: 1 }}>
          {/* Stat */}
          <div style={{
            color: style.text,
            fontFamily: "'Space Mono', monospace",
            fontWeight: "900",
            fontSize: card.stat.length > 12 ? "28px" : "48px",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}>
            {card.stat}
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: "2px", background: style.accent, marginBottom: "20px" }} />

          {/* Label */}
          <div style={{
            color: "#fff",
            fontSize: "18px",
            lineHeight: "1.55",
            marginBottom: "24px",
            fontWeight: "600",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {card.label}
          </div>

          {/* Detail */}
          <div style={{
            color: "rgba(255,255,255,0.72)",
            fontSize: "14px",
            lineHeight: "1.8",
            marginBottom: "32px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            borderLeft: `3px solid ${style.accent}55`,
            paddingLeft: "16px",
          }}>
            {card.detail}
          </div>

          {/* Source block */}
          <div style={{
            background: "#161616",
            border: `1px solid ${style.accent}33`,
            padding: "16px",
            marginBottom: "24px",
          }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", marginBottom: "8px" }}>
              CITED SOURCE — VERIFY YOURSELF
            </div>
            <div style={{ color: "#fff", fontFamily: "monospace", fontSize: "12px", marginBottom: "10px", fontWeight: "bold" }}>
              {card.source}
            </div>
            <a
              href={card.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: style.accent,
                color: "#000",
                padding: "8px 14px",
                fontFamily: "monospace",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "1px",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              VERIFY SOURCE ↗
            </a>
          </div>

          {/* Download from panel */}
          <button
            onClick={() => drawAndDownloadCard(card)}
            style={{
              width: "100%",
              background: "transparent",
              border: `1px solid ${style.accent}`,
              color: style.accent,
              padding: "12px",
              fontFamily: "monospace",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
              letterSpacing: "2px",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = style.accent; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = style.accent; }}
          >
            DOWNLOAD IMAGE (1080×1080)
          </button>
        </div>
      </div>
    </>
  );
}

function ViewModal({ card, onClose }) {
  const style = getCardStyle(card.category);

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: style.bg,
          border: `2px solid ${style.accent}`,
          borderTop: `6px solid ${style.accent}`,
          padding: "40px",
          maxWidth: "600px",
          width: "100%",
          cursor: "default",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <div style={{ color: style.accent, fontFamily: "monospace", fontSize: "13px", fontWeight: "bold", letterSpacing: "2px" }}>
              [{card.category}]
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontFamily: "monospace", fontSize: "10px", marginTop: "4px" }}>
              CONCERNED NIGERIAN
            </div>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: "12px" }}>
            #{String(card.uid).padStart(4, "0")}
          </span>
        </div>

        <div style={{
          color: style.text,
          fontFamily: "'Space Mono', monospace",
          fontWeight: "900",
          fontSize: card.stat.length > 10 ? "36px" : "64px",
          lineHeight: 1.1,
          marginBottom: "20px",
        }}>
          {card.stat}
        </div>

        <div style={{ width: "100%", height: "3px", background: style.accent, marginBottom: "20px" }} />

        <div style={{ color: "#fff", fontSize: "20px", lineHeight: "1.5", marginBottom: "24px", fontWeight: "600" }}>
          {card.label}
        </div>

        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontFamily: "monospace", marginBottom: "6px" }}>
          SOURCE: {card.source}
        </div>
        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", fontFamily: "monospace", marginBottom: "28px" }}>
          {card.sourceUrl}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => drawAndDownloadCard(card)}
            style={{
              flex: 1,
              background: style.accent,
              color: "#000",
              border: "none",
              padding: "14px 20px",
              fontFamily: "monospace",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              letterSpacing: "1px",
            }}
          >
            DOWNLOAD (1080×1080)
          </button>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              padding: "14px 24px",
              fontFamily: "monospace",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [page, setPage] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [viewCard, setViewCard] = useState(null);
  const [readCard, setReadCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const CARDS_PER_PAGE = 50;

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
  };

  const filtered = ALL_CARDS.filter((c) => {
    const matchesCategory = activeCategory === "ALL" || c.category === activeCategory;
    const matchesQuery =
      c.stat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const paginated = filtered.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);

  const downloadAll = async () => {
    setDownloading(true);
    for (let i = 0; i < Math.min(paginated.length, 20); i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      drawAndDownloadCard(paginated[i]);
    }
    setDownloading(false);
  };

  return (
    <div style={{ background: "#080808", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#fff" }}>
      {/* Navigation */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,10,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #222",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
          onClick={() => { setActiveCategory("ALL"); setSearchQuery(""); setPage(0); }}
        >
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#00FF88", boxShadow: "0 0 10px #00FF88" }} />
          <span style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: "900", letterSpacing: "2px" }}>
            CONCERNED NIGERIAN
          </span>
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: "400px", flex: 1 }}>
          <input
            type="text"
            placeholder="Search statistics, categories, or sources..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            style={{
              width: "100%",
              background: "#161616",
              border: "1px solid #333",
              padding: "10px 16px 10px 36px",
              borderRadius: "20px",
              color: "#fff",
              fontSize: "13px",
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#FF4500"; }}
            onBlur={(e) => { e.target.style.borderColor = "#333"; }}
          />
          <span style={{ position: "absolute", left: "14px", top: "52%", transform: "translateY(-50%)", color: "#666", fontSize: "14px", pointerEvents: "none" }}>
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: "12px" }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span style={{ color: "#888", fontSize: "11px", fontFamily: "monospace", fontWeight: "bold", letterSpacing: "1px", cursor: "pointer" }}>FEED</span>
          <span style={{ color: "#888", fontSize: "11px", fontFamily: "monospace", fontWeight: "bold", letterSpacing: "1px", cursor: "pointer" }}>CAMPAIGNS</span>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: "#00FF88", fontFamily: "monospace", fontSize: "10px", letterSpacing: "1px", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.user_metadata?.username || user.email?.split("@")[0]}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent", border: "1px solid #333",
                  color: "#888", borderRadius: "16px", padding: "7px 14px",
                  fontSize: "10px", fontFamily: "monospace", fontWeight: "bold",
                  cursor: "pointer", letterSpacing: "1px",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF4500"; e.currentTarget.style.color = "#FF4500"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#888"; }}
              >
                LOG OUT
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              style={{
                background: "#FF4500", color: "#fff", border: "none",
                borderRadius: "16px", padding: "8px 18px",
                fontSize: "11px", fontFamily: "monospace", fontWeight: "bold",
                cursor: "pointer", letterSpacing: "1px",
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.04)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              LOGIN
            </button>
          )}
        </div>
      </div>

      {/* Hero */}
      <div style={{ borderBottom: "1px solid #222", padding: "40px 40px 30px", background: "#0a0a0a" }}>
        <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#FF4500", letterSpacing: "4px", marginBottom: "12px", fontWeight: "bold" }}>
          NIGERIA ACCOUNTABILITY PROJECT
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: "900", letterSpacing: "-2px", lineHeight: 1, margin: "0 0 16px", color: "#fff" }}>
          1,000 REASONS<br />
          <span style={{ color: "#FF4500" }}>NIGERIA SAYS NO.</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", maxWidth: "600px", lineHeight: "1.6", margin: "0 0 24px" }}>
          Cards cite public records, government reports, and international bodies. Numbers are corrected where fact-checks found errors — always open <strong style={{ color: "#fff" }}>READ</strong> for context and follow the source link.
          Click <strong style={{ color: "#fff" }}>VIEW</strong> to preview, <strong style={{ color: "#fff" }}>READ</strong> for full context and source links, or <strong style={{ color: "#fff" }}>DOWNLOAD</strong> for a shareable 1080×1080 graphic.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ background: "#FF4500", color: "#fff", padding: "8px 16px", fontFamily: "monospace", fontSize: "12px", fontWeight: "bold", letterSpacing: "1px" }}>
            {filtered.length} CARDS {searchQuery && "FOUND"}
          </div>
          <button
            onClick={downloadAll}
            disabled={downloading}
            style={{
              background: "transparent", border: "1px solid #FF4500", color: "#FF4500",
              padding: "8px 16px", fontFamily: "monospace", fontSize: "12px",
              cursor: "pointer", letterSpacing: "1px",
            }}
          >
            {downloading ? "DOWNLOADING..." : "DOWNLOAD PAGE (20)"}
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div style={{
        padding: "16px 40px", borderBottom: "1px solid #1a1a1a",
        display: "flex", gap: "8px", flexWrap: "wrap",
        background: "#090909", overflowX: "auto",
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setPage(0); }}
            style={{
              background: activeCategory === cat ? "#FF4500" : "transparent",
              border: `1px solid ${activeCategory === cat ? "#FF4500" : "#333"}`,
              color: activeCategory === cat ? "#fff" : "#666",
              padding: "6px 14px", fontFamily: "monospace", fontSize: "10px",
              cursor: "pointer", letterSpacing: "1px", fontWeight: "bold",
              whiteSpace: "nowrap", transition: "all 0.15s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{
        padding: "32px 40px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "12px",
      }}>
        {paginated.map((card) => (
          <CardComponent
            key={card.uid}
            card={card}
            onView={setViewCard}
            onRead={setReadCard}
            onDownload={drawAndDownloadCard}
          />
        ))}
      </div>

      {/* Pagination */}
      <div style={{ padding: "24px 40px 48px", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          style={{
            background: "transparent", border: "1px solid #333",
            color: page === 0 ? "#333" : "#fff",
            padding: "8px 20px", fontFamily: "monospace", fontSize: "11px",
            cursor: page === 0 ? "default" : "pointer",
          }}
        >
          PREV
        </button>
        <span style={{ color: "#555", fontFamily: "monospace", fontSize: "11px" }}>
          PAGE {page + 1} / {totalPages} — {filtered.length} CARDS
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page === totalPages - 1}
          style={{
            background: page === totalPages - 1 ? "transparent" : "#FF4500",
            border: "1px solid #FF4500", color: "#fff",
            padding: "8px 20px", fontFamily: "monospace", fontSize: "11px",
            cursor: page === totalPages - 1 ? "default" : "pointer",
          }}
        >
          NEXT
        </button>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #1a1a1a", padding: "24px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px",
      }}>
        <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#333", letterSpacing: "2px" }}>
          CITED PUBLIC SOURCES — VERIFY BEFORE YOU SHARE
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#FF4500", letterSpacing: "2px" }}>
          DOWNLOAD. SHARE. REPEAT.
        </div>
      </div>

      {/* VIEW modal */}
      {viewCard && <ViewModal card={viewCard} onClose={() => setViewCard(null)} />}

      {/* READ panel */}
      {readCard && <ReadPanel card={readCard} onClose={() => setReadCard(null)} />}
    </div>
  );
}
