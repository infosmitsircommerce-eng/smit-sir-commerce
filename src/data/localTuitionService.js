export const localTuitionService = {
  title: 'Classes in Mehsana for Class 11 & 12 Commerce | Coaching & Tuition',
  description: 'Looking for classes in Mehsana for Class 11 or 12? Smit Sir Commerce offers Commerce learning support for Economics, Business Studies and Entrepreneurship, with demo, home-tuition and online options subject to availability.',
  phone: '+916353709585',
  phoneLabel: '+91 63537 09585',
  mapsUrl: 'https://maps.app.goo.gl/T5t5Mw2jKiqbozgi8?g_st=ac',
  heading: 'Classes in Mehsana for Class 11 & 12 Commerce',
  intro: 'Looking for classes in Mehsana, coaching classes in Mehsana or tuition for Class 11 and 12 Commerce? Students can enquire about home tuition at the student’s location in Mehsana or online learning support. Support is available for Economics, Business Studies and Entrepreneurship. Share your class, board, subject and area so travel availability, timing and the suitable learning format can be confirmed before you join.',
  modes: [
    { title: 'Home tuition for Commerce in Mehsana', description: 'Students can enquire about Class 11 or Class 12 Commerce lessons at their home in Mehsana. Share your area or landmark to confirm travel availability, timing and fees.', channel: 'offline' },
    { title: 'Online Commerce learning support', description: 'If travel or timing makes home tuition impractical, ask about online learning support for the same Commerce subjects and revision needs.', channel: 'online' },
  ],
  faqs: [
    ['Are Commerce classes available near me in Mehsana?', 'If you are in Mehsana, you can enquire about Class 11 and Class 12 Commerce home tuition at the student’s location, subject to travel availability. Share your area so availability can be confirmed.'],
    ['Do you teach both Class 11 and Class 12 Commerce students?', 'Yes. Learning support is available for Class 11 and Class 12 students, including Economics, Business Studies and Entrepreneurship.'],
    ['Do you provide home tuition in Mehsana?', 'Students can enquire about lessons at their home in Mehsana. Travel availability and timings are confirmed for the student’s area before enrolment.'],
    ['Can I try a demo before joining Commerce tuition?', 'Yes. Students and parents can request a demo or paper analysis before deciding whether the learning approach is suitable.'],
    ['How much does Commerce tuition cost?', 'Contact Smit Sir with your class, board, subject, area and preferred learning format for the current tuition fee. Home tuition and online support can have different arrangements. The ₹199 Board Booster is a separate digital revision pack, not the tuition fee.'],
  ],
};

export function localTuitionChannels(base) {
  return localTuitionService.modes.map((mode) => ({
    '@type': 'ServiceChannel',
    name: mode.title,
    ...(mode.channel === 'offline' ? { serviceLocation: { '@type': 'City', name: 'Mehsana' } } : {}),
    serviceUrl: `${base}/book-demo?mode=${mode.channel === 'online' ? 'Online' : 'Offline'}`,
    servicePhone: { '@type': 'ContactPoint', telephone: localTuitionService.phone, contactType: 'tuition enquiries' },
  }));
}
