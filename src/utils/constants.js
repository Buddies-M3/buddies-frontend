export const layoutConstant = {
  topbarHeight: 40,
  headerHeight: 80,
  mobileNavHeight: 64,
  containerWidth: 1200,
  mobileHeaderHeight: 64,
  grocerySidenavWidth: 280
};

export const backend = {
  host: "http://localhost:8080"
};

export const googleMapApi = {
  apiKey: "AIzaSyB15BarZWa9xFEkXeMtAcNsLwODRFR9GGc",
  initialLat: 37.7749, // San Francisco
  initialLng: -122.4194
};

export const smtp = {
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'cassie19@ethereal.email',
      pass: 'DHyZg1QaRgvnyGCUcM'
  }
}

export const backloop = {
  protocol: process.env.NEXT_PUBLIC_HTTP_PROT
}

export const CarbonCreditType = {
  // Renewable energy types
  RenewableEnergy: {
      Wind: "RenewableEnergy (Wind)",          // Wind power projects
      pv: "RenewableEnergy (PV)",        // Solar power projects
      Hydro: "RenewableEnergy (Hydro)",        // Hydroelectric power projects
      Geothermal: "RenewableEnergy (Geothermal)", // Geothermal energy projects
      Biomass: "RenewableEnergy (Biomass)"     // Biomass energy projects
  },

  // Other carbon credit types
  ForestryAndLandUse: "ForestryAndLandUse",       // Forestry and land use projects
  EnergyEfficiency: "EnergyEfficiency",           // Energy efficiency improvement projects
  MethaneReduction: "MethaneReduction",           // Methane emission reduction projects
  WasteManagement: "WasteManagement",             // Waste management and landfill projects
  IndustrialGasReduction: "IndustrialGasReduction", // Industrial gas reduction projects
  Transportation: "Transportation",               // Transportation emission reduction projects
  SoilCarbon: "SoilCarbon",                       // Soil carbon sequestration projects
  MarineAndCoastal: "MarineAndCoastal",           // Marine and coastal ecosystem projects
  BlueCarbon: "BlueCarbon",                       // Blue carbon projects in coastal and marine environments
  Biochar: "Biochar",                             // Production and use of biochar for soil carbon storage
  Afforestation: "Afforestation",                 // Planting new forests on non-forested land
  AvoidedConversion: "AvoidedConversion"          // Preventing the conversion of forests to other land uses
};