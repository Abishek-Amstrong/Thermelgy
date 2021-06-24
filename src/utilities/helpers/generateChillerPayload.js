import moment from 'moment';

const generateChillerPayload = type => {
  let payload;
  let start_time = moment()
    .subtract(1, 'day')
    .toISOString(true)
    .replace('+05:30', 'Z');
  let end_time = moment().toISOString(true).replace('+05:30', 'Z');

  switch (type) {
    case 'approach-cond_evap':
      //   approach - cond & evap
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'hourly',
          client_id: 'Hablis',
          machine_type: 'Chiller',
          machine_id: 'CH01',
          field: ['CondAphTempAvg', 'EvpAphTempAvg'],
          display_title: 'Temperature VS Time',
          axes_title: ['last 1 Day', '°C'],
          dataset_name: ['Cond Apch Temp', ' Evap Apch Temp'],
          data_color: ['#fa6340', '#234e9e', '#e63946', '#ff9f1c'],
          threshold: 1,
        },
      };
      break;
    case 'approach-ct':
      //   approach - ct
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'hourly_secondary',
          client_id: 'Hablis',
          machine_type: 'Chiller',
          machine_id: 'CH01',
          field: ['coolingTowerAph'],
          display_title: 'Temperature VS Time',
          axes_title: ['Last one day', '°C'],
          dataset_name: ['Cooling Tower Aph Temp'],
          data_color: ['#fa6340', '#234e9e', '#e71d36', '#5e72e4'],
          threshold: 1,
        },
      };
      break;
    case 'chiller_perf-perf':
      //   chiller performance - performace
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'hourly_secondary',
          client_id: 'Hablis',
          machine_type: 'Chiller',
          machine_id: 'CH01',
          field: ['hourlyPerformance'],
          display_title: 'Temperature VS Time',
          axes_title: ['Last one Day', 'ikW/TR'],
          dataset_name: ['Performance factor'],
          data_color: ['#4bb305', '#e71d36', '#fa6340', '#5e72e4'],
          threshold: 1,
        },
      };
      break;
    case 'chiller_perf-cw_delivery':
      // chiller performance - chiller water delivery
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'hourly',
          client_id: 'Hablis',
          machine_type: 'Chiller',
          machine_id: 'CH01',
          field: ['ActvSetPoTempAvg', 'EvapWatrOutAvg'],
          display_title: 'Temperature VS Time',
          axes_title: ['Last one Day', '°C'],
          dataset_name: ['Set Point', 'Evap Outlet'],
          data_color: ['#4bb305', '#e71d36', '#fa6340', '#5e72e4'],
          threshold: 1,
        },
      };
      break;
    case 'ct_perf-perf':
      // c.t. performance
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'hourly_secondary',
          client_id: 'Hablis',
          machine_type: 'Chiller',
          machine_id: 'CH01',
          field: ['CTEfficiency'],
          display_title: 'Temperature VS Time',
          axes_title: ['Last one Day', 'µ'],
          dataset_name: ['C.T Efficiency'],
          data_color: ['#004f5c', '#eb5555', '#fdca08', '#fa6340'],
          threshold: 1,
        },
      };
      break;
    case 'ct_perf-evap':
      //  ct performance - evap loss and blowdown
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'hourly',
          client_id: 'Hablis',
          machine_type: 'Chiller',
          machine_id: 'CH01',
          field: ['EvaporationLoss', 'BlowDown'],
          display_title: 'Temperature VS Time',
          axes_title: ['Last one Day', 'm³/h'],
          dataset_name: ['Evap loss', ' Blowdown'],
          data_color: ['#004f5c', '#eb5555', '#fdca08', '#fa6340'],
          threshold: 1,
        },
      };
      break;
    case 'hourly-io_energy':
      start_time = moment()
        .subtract(1, 'hour')
        .toISOString(true)
        .replace('+05:30', 'Z');
      end_time = moment().toISOString(true).replace('+05:30', 'Z');
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'minute',
          client_id: 'Lucas',
          machine_type: 'Heatpump',
          machine_id: 'HPSPLA1',
          field: ['instantaneousElectricalEnergyHP'],
          display_title: 'Temperature VS Time',
          axes_title: ['Last one hour', 'kWh'],
          dataset_name: ['Electrical Energy HP'],
          data_color: ['#234e9e', '#e71d36', '#fa6340', '#5e72e4'],
          threshold: 1,
          threshold_value: null,
        },
      };
      break;
    case 'daily-io_energy':
      start_time = moment()
        .subtract(1, 'day')
        .toISOString(true)
        .replace('+05:30', 'Z');
      end_time = moment().toISOString(true).replace('+05:30', 'Z');
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'hourly',
          client_id: 'Lucas',
          machine_type: 'Heatpump',
          machine_id: 'HPSPLA1',
          field: ['electricalEnergyHourlyHP', 'hotSideThermalEnergyHourly'],
          display_title: 'Temperature VS Time',
          axes_title: ['Last one day', 'kWh'],
          dataset_name: ['Electrical Energy-HP', 'Thermal Energy Hotside-HP'],
          data_color: ['#234e9e', '#e71d36', '#fa6340', '#5e72e4'],
          threshold: 1,
          threshold_value: null,
        },
      };
      break;
    case 'monthly-io_energy':
      start_time = moment()
        .subtract(1, 'month')
        .toISOString(true)
        .replace('+05:30', 'Z');
      end_time = moment().toISOString(true).replace('+05:30', 'Z');
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'daily',
          client_id: 'Lucas',
          machine_type: 'Heatpump',
          machine_id: 'HPSPLA1',
          field: ['electricalEnergyDailyHP', 'hotSideThermalEnergyDaily'],
          display_title: 'Temperature VS Time',
          axes_title: ['Last one month', 'kWh'],
          dataset_name: ['Electrical Energy-HP', 'Thermal Energy Hotside-HP'],
          data_color: ['#234e9e', '#e63946', '#fa6340', '#5e72e4'],
          threshold: 1,
          threshold_value: null,
        },
      };
      break;
    case 'hourly-cop':
      start_time = moment()
        .subtract(1, 'hour')
        .toISOString(true)
        .replace('+05:30', 'Z');
      end_time = moment().toISOString(true).replace('+05:30', 'Z');
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'minute',
          client_id: 'Lucas',
          machine_type: 'Heatpump',
          machine_id: 'HPSPLA1',
          field: ['instantaneousElectricalEnergyHP'],
          display_title: 'Temperature VS Time',
          axes_title: ['Last one hour', 'kWh'],
          dataset_name: ['Electrical Energy HP'],
          data_color: ['#234e9e', '#e71d36', '#fa6340', '#5e72e4'],
          threshold: 1,
          threshold_value: null,
        },
      };
      break;
    case 'daily-cop':
      start_time = moment()
        .subtract(1, 'day')
        .toISOString(true)
        .replace('+05:30', 'Z');
      end_time = moment().toISOString(true).replace('+05:30', 'Z');
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'hourly',
          client_id: 'Lucas',
          machine_type: 'Heatpump',
          machine_id: 'HPSPLA1',
          field: ['copHotSideHourly'],
          display_title: 'Temperature VS Time',
          axes_title: ['Last one day', 'COP'],
          dataset_name: ['cop Hot Side'],
          data_color: ['#234e9e', '#e71d36', '#fa6340', '#5e72e4'],
          threshold: 1,
          threshold_value: null,
        },
      };
      break;
    case 'monthly-cop':
      start_time = moment()
        .subtract(1, 'month')
        .toISOString(true)
        .replace('+05:30', 'Z');
      end_time = moment().toISOString(true).replace('+05:30', 'Z');
      payload = {
        api_name: 'chart_data',
        data: {
          start_time,
          end_time,
          time_range: 'daily',
          client_id: 'Lucas',
          machine_type: 'Heatpump',
          machine_id: 'HPSPLA1',
          field: ['copHotSideDaily'],
          display_title: 'Temperature VS Time',
          axes_title: ['Last one month', 'COP'],
          dataset_name: ['cop Hot Side'],
          data_color: ['#234e9e', '#e63946', '#fa6340', '#5e72e4'],
          threshold: 1,
          threshold_value: null,
        },
      };
  }

  return payload;
};

export const generateChartForChiller = (payload, range) => {
  let datasets = [],
    labels = [],
    colors = [],
    legend = [];

  console.log('generate-output-payload---> ', payload);

  switch (range) {
    case 'hourly':
      labels = payload.datasets[0].data
        .map(dst => moment.utc(dst[0]).format('HH:mm'))
        .reverse()
        .filter((v, idx) => idx < 7)
        .reverse();
      break;
    case 'daily':
      labels = payload.datasets[0].data
        .map(dst => moment.utc(dst[0]).format('HH A'))
        .reverse()
        .filter((v, idx) => idx < 7)
        .reverse();
      break;
      case 'monthly':
      labels = payload.datasets[0].data
        .map(dst => moment.utc(dst[0]).format('DD-MMM'))
        .reverse()
        .filter((v, idx) => idx < 7)
        .reverse();
      break;
    default:
      labels = payload.datasets[0].data
        .map(dst => moment.utc(dst[0]).format('HH:mm'))
        .reverse()
        .filter((v, idx) => idx < 7)
        .reverse();
  }

  datasets = payload.datasets
    .map((dst, idx) => ({
      data: dst.data.map(v => v[1]),
      color: () => (idx === 0 ? 'rgba(255,255,255)' : 'rgba(248, 253, 131)'),
    }))
    .reverse()
    .filter((v, idx) => idx < 7)
    .reverse();
  legend = payload.datasets.map(dst => dst.name);

  return {
    datasets,
    labels,
    colors,
    legend,
  };
};

export default generateChillerPayload;
