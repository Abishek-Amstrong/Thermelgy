export const heatPump = {
  1: {
    capacity: 28,
    ratedCop: 2.5,
    ratedTemp: 85,
    circPump: 5.5,
  },
  2: {
    capacity: 65,
    ratedCop: 2.5,
    ratedTemp: 85,
    circPump: 8,
  },
  3: {
    capacity: null,
    ratedCop: null,
    ratedTemp: null,
    circPump: null,
  },
};

export const chiller = {
  1: {
    chillerCapacity: 170,
    ratedIkw: 0.7,
    coolingSource: 'Air',
    primaryPump: 5.5,
    secondaryPump: 15,
    condenserPump: 'NA',
    coolingTower: 'NA',
  },
  2: {
    chillerCapacity: 280,
    ratedIkw: 0.9,
    coolingSource: 'Water',
    primaryPump: 8,
    secondaryPump: 19,
    condenserPump: 18,
    coolingTower: 5,
  },
  3: {
    chillerCapacity: null,
    ratedIkw: null,
    coolingSource: null,
    primaryPump: null,
    secondaryPump: 11,
    condenserPump: 18,
    coolingTower: 7.5,
  },
};
