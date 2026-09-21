export const localTuitionService = {
  title: 'Classes in Mehsana for Class 11 & 12 Commerce | Coaching & Tuition',
  description: 'Looking for classes in Mehsana for Class 11 or 12? Smit Sir Commerce offers Commerce coaching and tuition in Mehsana for Economics, Business Studies and Entrepreneurship, with demo and home-tuition options.',
  phone: '+916353709585',
  phoneLabel: '+91 63537 09585',
  mapsUrl: 'https://maps.app.goo.gl/T5t5Mw2jKiqbozgi8?g_st=ac',
  heading: 'Classes in Mehsana for Class 11 & 12 Commerce',
  intro: 'Looking for classes in Mehsana, coaching classes in Mehsana or tuition for Class 11 and 12 Commerce? Students can enquire about face-to-face lessons at Smit Sir’s tuition location or lessons at their home in Mehsana. Support is available for Economics, Business Studies and Entrepreneurship. Share your class, board, subject and area so the suitable learning option, travel availability and timing can be confirmed before you join.',
  modes: [
    { title: 'Commerce classes at Smit Sir’s location', description: 'Attend Class 11 or Class 12 Commerce lessons in person in Mehsana. Contact Smit Sir for the exact location and current class timings before visiting.' },
    { title: 'Home tuition for Commerce in Mehsana', description: 'Students can also enquire about Commerce home tuition in Mehsana. Share your area or landmark to confirm travel availability, timing and fees.' },
  ],
  faqs: [
    ['Are Commerce classes available near me in Mehsana?', 'If you are in Mehsana, you can enquire about Class 11 and Class 12 Commerce lessons at Smit Sir’s tuition location or home tuition at the student’s location. Share your area so availability can be confirmed.'],
    ['Do you teach both Class 11 and Class 12 Commerce students?', 'Yes. Learning support is available for Class 11 and Class 12 students, including Economics, Business Studies and Entrepreneurship.'],
    ['Do you provide home tuition in Mehsana?', 'Yes. Students can enquire about lessons at their home in Mehsana as well as classes at Smit Sir’s tuition location. Travel availability and timings are confirmed for your area before enrolment.'],
    ['Can I try a demo before joining Commerce tuition?', 'Yes. Students and parents can request a demo or paper analysis before deciding whether the learning approach is suitable.'],
    ['How much does Commerce tuition cost?', 'Contact Smit Sir with your class, board, subject and preferred lesson location for the current tuition fee. Home tuition and classes at the tuition location may have different fees. The ₹199 Board Booster is a separate digital revision pack, not the tuition fee.'],
  ],
};

export function localTuitionChannels(base) {
  return localTuitionService.modes.map((mode) => ({
    '@type': 'ServiceChannel',
    name: mode.title,
    serviceLocation: { '@type': 'City', name: 'Mehsana' },
    serviceUrl: `${base}/book-demo?mode=Offline`,
    servicePhone: { '@type': 'ContactPoint', telephone: localTuitionService.phone, contactType: 'tuition enquiries' },
  }));
}
