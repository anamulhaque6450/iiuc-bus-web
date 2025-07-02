import { BusSchedule } from '../types/BusSchedule';

export const busSchedules: BusSchedule[] = [
  // REGULAR SCHEDULE (Saturday to Wednesday)
  // City to IIUC - Female Students
  {
    id: '1',
    time: '6:40 AM',
    startingPoint: 'Baroyarhat',
    route: 'Baroyarhat–Mirsharai–Borodargahat–Sitakunda–IIUC',
    endPoint: 'IIUC',
    direction: 'CityToIIUC',
    gender: 'Female',
    scheduleType: 'Regular'
  },
  {
    id: '2',
    time: '6:45 AM',
    startingPoint: 'Hathazari College',
    route: 'Hathazari College–Borodighirpar–Baizid Link Road–IIUC',
    endPoint: 'IIUC',
    direction: 'CityToIIUC',
    gender: 'Female',
    scheduleType: 'Regular'
  },
  {
    id: '3',
    time: '7:00 AM',
    startingPoint: 'BOT',
    route: 'Muradpur–2 no gate–Baizid Link Road–IIUC',
    endPoint: 'IIUC',
    direction: 'CityToIIUC',
    gender: 'Female',
    scheduleType: 'Regular'
  },
  {
    id: '4',
    time: '7:00 AM',
    startingPoint: 'Chatteswari',
    route: 'Chatteswari Road–GEC–2 no gate–Baizid Link Road–IIUC',
    endPoint: 'IIUC',
    direction: 'CityToIIUC',
    gender: 'Female',
    scheduleType: 'Regular'
  },
  // City to IIUC - Male Students
  {
    id: '5',
    time: '8:30 AM',
    startingPoint: 'CUET',
    route: 'CUET Gate–Kuwaish–Oxygen–IIUC',
    endPoint: 'IIUC',
    direction: 'CityToIIUC',
    gender: 'Male',
    scheduleType: 'Regular'
  },
  {
    id: '6',
    time: '9:00 AM',
    startingPoint: 'BOT',
    route: 'BOT (Bahaddarhat)–Muradpur–2 no gate–Baizid Link Road–IIUC',
    endPoint: 'IIUC',
    direction: 'CityToIIUC',
    gender: 'Male',
    scheduleType: 'Regular'
  },
  // Return Shuttles
  {
    id: '7',
    time: '11:00 AM',
    startingPoint: 'IIUC',
    route: 'IIUC–KoibolyoDham–Noyabazar–Boropul',
    endPoint: 'Boropul',
    direction: 'IIUCToCity',
    gender: 'Female',
    description: 'Shuttle (Female)',
    scheduleType: 'Regular'
  },
  {
    id: '8',
    time: '4:35 PM',
    startingPoint: 'IIUC',
    route: 'All approved routes',
    endPoint: 'All points',
    direction: 'IIUCToCity',
    gender: 'Female',
    description: 'Shuttle (Female)',
    scheduleType: 'Regular'
  },
  // FRIDAY SCHEDULE
  {
    id: 'f1',
    time: '7:30 AM',
    busType: 'IIUC Bus',
    startingPoint: 'BOT',
    route: 'BOT–Chatteswari–WASA–GEC–Khulshi–AK Khan–IIUC',
    endPoint: 'IIUC',
    direction: 'ToUniversity',
    remarks: 'For ministerial staff',
    scheduleType: 'Friday'
  },
  {
    id: 'f2',
    time: '8:00 AM',
    busType: 'AC Bus',
    startingPoint: 'Kazi Elysium',
    route: 'Kazi Elysium–Chatteswari–WASA–GEC–Khulshi–AK Khan–IIUC',
    endPoint: 'IIUC',
    direction: 'ToUniversity',
    remarks: 'For Teachers & Officer',
    scheduleType: 'Friday'
  },
  {
    id: 'f3',
    time: '12:10 PM',
    busType: 'IIUC Bus',
    startingPoint: 'IIUC',
    route: 'IIUC–AK Khan–Wireless–Khulshi–WASA–Chatteswari Road',
    endPoint: 'Chatteswari Road',
    direction: 'FromUniversity',
    remarks: 'Students',
    scheduleType: 'Friday'
  },
  {
    id: 'f4',
    time: '6:30 PM',
    busType: 'IIUC A&H B',
    startingPoint: 'IIUC',
    route: 'IIUC–AK Khan–Wireless–Khulshi–WASA–Chatteswari Road',
    endPoint: 'Chatteswari Road',
    direction: 'FromUniversity',
    remarks: 'For all',
    scheduleType: 'Friday'
  }
];