export const localTuitionService = {
  title: 'Commerce Tuition & Coaching in Mehsana | Class 11 & 12',
  description: 'Class 11 & 12 Commerce tuition in Mehsana: Economics, Business Studies and Entrepreneurship. Classes at Smit Sir’s location or home tuition. Call 6353709585.',
  phone: '+916353709585',
  phoneLabel: '+91 63537 09585',
  heading: 'Classes at Smit Sir’s location or home tuition in Mehsana',
  intro: 'Choose face-to-face lessons at Smit Sir’s tuition location or enquire about lessons at your home in Mehsana. Share your class, board, subject and area so the location, travel availability and suitable timing can be confirmed before you join.',
  modes: [
    { title: 'Classes at Smit Sir’s location', description: 'Attend in person in Mehsana. Contact Smit Sir for the exact location and current class timings before visiting.' },
    { title: 'Home tuition in Mehsana', description: 'Smit Sir can also teach at the student’s home. Share your area or landmark to confirm travel availability, timing and fees.' },
  ],
  faqs: [
    ['Do you provide home tuition in Mehsana?', 'Yes. Students can enquire about lessons at their home in Mehsana as well as classes at Smit Sir’s tuition location. Travel availability and timings are confirmed for your area before enrolment.'],
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
