import moment from 'moment';

function generateEnergyPayload(payload, selectedType) {
  payload.api_name = 'chart_data';
  payload.data = {
    ...payload.data,
    end_time: moment().toISOString(true).replace('+05:30', 'Z'),
    field: ['electricalEnergy'],
    axes_title: ['Time,kWh'],
    display_title: 'Electrical Energy VS Time',
    dataset_name: ['electricalEnergy'],
    data_color: ['#fa6340,#ffg450'],
    threshold: 1,
  };

  switch (selectedType) {
    case 'power':
      payload = {
        ...payload,
        data: {
          ...payload.data,
          axes_title: ['Last one month', 'kW', 'kVA'],
          data_color: ['#5603ad', '#3d86c9', '#e63946', '#fa6340', '#5e72e4'],
          dataset_name: ['Pavg', 'Pmin', 'Pmax', 'PAmin'],
          display_title: 'Temperature VS Time',
          field: ['realpower.Pavg', 'realpower.Pmin', 'realpower.Pmax'],
        },
      };
      break;
    case 'current':
      payload = {
        ...payload,
        data: {
          ...payload.data,
          axes_title: ['Last one month', 'Amps'],
          data_color: ['#5603ad', '#3d86c9', '#e63946', '#fa6340', '#5e72e4'],
          dataset_name: ['I (AVGL)'],
          display_title: 'Temperature VS Time',
          field: ['current.AVGILavg'],
        },
      };
      break;
    case 'power-factor':
      payload = {
        ...payload,
        data: {
          ...payload.data,
          axes_title: ['Last one month', 'Φ'],
          data_color: ['#5603ad', '#3d86c9', '#e63946', '#fa6340', '#5e72e4'],
          dataset_name: ['PFavg'],
          display_title: 'Temperature VS Time',
          field: ['powerfactor.AVGPFavg'],
        },
      };
      break;
    case 'voltage':
      payload = {
        ...payload,
        data: {
          ...payload.data,
          axes_title: ['Last one month', 'Volts'],
          data_color: ['#5603ad', '#3d86c9', '#e63946', '#fa6340', '#5e72e4'],
          dataset_name: ['V (AVGP)', 'V (AVGLL)'],
          display_title: 'Temperature VS Time',
          field: ['voltage.AVGVPavg', 'voltage.AVGVLLavg'],
        },
      };
      break;
  }

  switch (payload.data.time_range) {
    case 'ea_hourly':
      payload.data.start_time = moment()
        .subtract(1, 'day')
        .toISOString(true)
        .replace('+05:30', 'Z');
      console.log('TCL: generateEnergyPayload -> payload.data', payload.data);
      break;
    case 'ea_daily':
      payload.data.start_time = moment()
        .subtract(1, 'week')
        .toISOString(true)
        .replace('+05:30', 'Z');
      break;
    case 'ea_monthly':
      payload.data.start_time = moment()
        .subtract(1, 'year')
        .toISOString(true)
        .replace('+05:30', 'Z');
      break;
  }

  return payload;
}

export default generateEnergyPayload;
