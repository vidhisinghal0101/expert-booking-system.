require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./models/Expert');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expert_booking';

// Generate slots for the next 7 days
const generateSlots = (timesPerDay) => {
  const slots = [];
  const times = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM'
  ];

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

    // Pick a subset of times for this day
    const dayTimes = times.slice(0, timesPerDay);
    dayTimes.forEach((time) => {
      slots.push({ date: dateStr, time, isBooked: false });
    });
  }

  return slots;
};

const experts = [
  {
    name: 'Alice Chen',
    category: 'Tech',
    experience: 8,
    rating: 4.8,
    bio: 'Full-stack engineer with expertise in React, Node.js, and cloud architecture. Helped 50+ startups scale their tech infrastructure.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=AliceChen',
    availableSlots: generateSlots(9)
  },
  {
    name: 'Marcus Johnson',
    category: 'Business',
    experience: 12,
    rating: 4.7,
    bio: 'Serial entrepreneur and business strategist. Founded 3 successful companies and mentored over 200 founders through growth challenges.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=MarcusJohnson',
    availableSlots: generateSlots(8)
  },
  {
    name: 'Dr. Priya Sharma',
    category: 'Health',
    experience: 15,
    rating: 4.9,
    bio: 'Board-certified physician specializing in preventive medicine and wellness coaching. Passionate about holistic health approaches.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=PriyaSharma',
    availableSlots: generateSlots(10)
  },
  {
    name: 'Robert Kim',
    category: 'Finance',
    experience: 10,
    rating: 4.6,
    bio: 'CFA charterholder with expertise in personal finance, investment strategies, and retirement planning for high-net-worth individuals.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=RobertKim',
    availableSlots: generateSlots(8)
  },
  {
    name: 'Sarah Mitchell',
    category: 'Legal',
    experience: 9,
    rating: 4.5,
    bio: 'Corporate attorney specializing in startup law, IP protection, and contract negotiations. Former BigLaw partner turned independent advisor.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=SarahMitchell',
    availableSlots: generateSlots(9)
  },
  {
    name: 'David Park',
    category: 'Design',
    experience: 7,
    rating: 4.8,
    bio: 'UX/UI designer with a background in cognitive psychology. Designed products used by millions at top Silicon Valley companies.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=DavidPark',
    availableSlots: generateSlots(8)
  },
  {
    name: 'Elena Rodriguez',
    category: 'Tech',
    experience: 6,
    rating: 4.4,
    bio: 'Machine learning engineer specializing in NLP and computer vision. Published researcher with 10+ papers in top AI conferences.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=ElenaRodriguez',
    availableSlots: generateSlots(9)
  },
  {
    name: 'James Okafor',
    category: 'Business',
    experience: 14,
    rating: 4.7,
    bio: 'Management consultant and executive coach. Former McKinsey partner with deep expertise in organizational transformation.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=JamesOkafor',
    availableSlots: generateSlots(8)
  },
  {
    name: 'Dr. Lisa Wang',
    category: 'Health',
    experience: 11,
    rating: 4.6,
    bio: 'Nutritionist and functional medicine practitioner. Specializes in gut health, hormonal balance, and chronic disease prevention.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=LisaWang',
    availableSlots: generateSlots(10)
  },
  {
    name: 'Michael Torres',
    category: 'Finance',
    experience: 8,
    rating: 4.5,
    bio: 'Venture capital analyst and startup financial advisor. Helped 30+ companies raise Series A and B funding rounds.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=MichaelTorres',
    availableSlots: generateSlots(9)
  },
  {
    name: 'Amanda Foster',
    category: 'Legal',
    experience: 13,
    rating: 4.8,
    bio: 'Employment law specialist and HR compliance expert. Advises Fortune 500 companies on workplace policies and dispute resolution.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=AmandaFoster',
    availableSlots: generateSlots(8)
  },
  {
    name: 'Carlos Mendez',
    category: 'Design',
    experience: 5,
    rating: 4.3,
    bio: 'Brand identity designer and creative director. Built visual identities for 100+ brands across tech, retail, and hospitality sectors.',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=CarlosMendez',
    availableSlots: generateSlots(9)
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB');

    await Expert.deleteMany({});
    console.log('[Seed] Cleared existing experts');

    const inserted = await Expert.insertMany(experts);
    console.log(`[Seed] Inserted ${inserted.length} experts`);

    inserted.forEach((e) => {
      console.log(`  - ${e.name} (${e.category}) — ${e.availableSlots.length} slots`);
    });

    console.log('[Seed] Done!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error:', err.message);
    process.exit(1);
  }
};

seed();
