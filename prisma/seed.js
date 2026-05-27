const {
  BlockType,
  Gender,
  InterestStatus,
  Locale,
  PrismaClient,
} = require('@prisma/client')

const prisma = new PrismaClient()

const locations = [
  'Colombo',
  'Kandy',
  'Galle',
  'Negombo',
  'Jaffna',
  'Matara',
  'Kurunegala',
  'Nugegoda',
  'Batticaloa',
  'Anuradhapura',
  'Kalutara',
  'Ratnapura',
]

const jobs = [
  'Software Engineer',
  'Accountant',
  'Teacher',
  'Doctor',
  'Architect',
  'Banking Officer',
  'Product Designer',
  'Civil Engineer',
  'Pharmacist',
  'Lecturer',
  'Marketing Manager',
  'Data Analyst',
]

const educations = [
  'BSc in Computer Science',
  'ACCA',
  'BA in Education',
  'MBBS',
  'BSc in Architecture',
  'BBA in Finance',
  'BA in Design',
  'BEng in Civil Engineering',
  'BPharm',
  'MSc in Statistics',
  'MBA',
  'BSc in Data Science',
]

const firstNames = [
  'Amaya',
  'Nuwan',
  'Ishara',
  'Tharindu',
  'Dinithi',
  'Kasun',
  'Sachini',
  'Ravindu',
  'Yasara',
  'Dilan',
  'Piumi',
  'Shehan',
]

const lastNames = [
  'Perera',
  'Fernando',
  'Silva',
  'Jayasinghe',
  'Wickramasinghe',
  'Gunasekara',
  'Ratnayake',
  'Samarasinghe',
  'Karunaratne',
  'Abeysekara',
  'Weerasinghe',
  'Dissanayake',
]

function profileData(index) {
  const gender = index % 2 === 0 ? Gender.FEMALE : Gender.MALE

  return {
    firstName: firstNames[index],
    lastName: lastNames[index],
    age: 24 + index,
    gender,
    location: locations[index],
    job: jobs[index],
    education: educations[index],
    height: index % 2 === 0 ? '5 feet 4 inches' : '5 feet 9 inches',
    religion: index % 3 === 0 ? 'Buddhist' : 'Christian',
    caste: index % 4 === 0 ? null : 'Not specified',
    motherTongue: index === 4 || index === 8 ? 'Tamil' : 'Sinhala',
    hobbies: index % 2 === 0
      ? ['Reading', 'Travel', 'Music']
      : ['Cricket', 'Cooking', 'Photography'],
    drinking: index % 3 === 0 ? 'Never' : 'Occasionally',
    smoking: index % 2 === 0 ? 'Never' : 'No',
    description: `${firstNames[index]} enjoys family time, meaningful conversation, and building a steady future.`,
    avatar: null,
    isActive: index !== 10,
  }
}

function preferenceData(index) {
  const ownGender = index % 2 === 0 ? Gender.FEMALE : Gender.MALE

  return {
    minAge: 23 + Math.max(index - 2, 0),
    maxAge: 33 + index,
    gender: ownGender === Gender.FEMALE ? Gender.MALE : Gender.FEMALE,
    location: index % 3 === 0 ? locations[index] : null,
    religion: index % 2 === 0 ? 'Buddhist' : null,
    caste: null,
  }
}

function advertBuilderData(index) {
  return {
    postingFor: index % 2 === 0 ? 'Self' : 'Family',
    candidateType: index % 2 === 0 ? 'bride' : 'groom',
    age: String(24 + index),
    location: locations[index],
    job: jobs[index],
    education: educations[index],
    height: index % 2 === 0 ? '5 feet 4 inches' : '5 feet 9 inches',
    religion: index % 3 === 0 ? 'Buddhist' : 'Christian',
    caste: '',
    motherTongue: index === 4 || index === 8 ? 'Tamil' : 'Sinhala',
    familyBackground: 'Respectful and close-knit family.',
    maritalStatus: 'Never married',
    diet: 'No preference',
    smokingHabit: 'Never',
    drinkingHabit: index % 3 === 0 ? 'Never' : 'Occasionally',
    hobbies: 'Reading, travel, music',
    interests: 'Community, food, and family events',
    personality: 'Kind, practical, and family-oriented',
    zodiacSign: '',
    lagna: '',
    nakshatra: '',
    horoscopeAvailable: 'Can be shared on request',
    kujaDosha: 'Unknown',
    lookingForAge: `${24 + index}-${34 + index}`,
    lookingForEducation: 'Graduate or professionally qualified',
    lookingForJob: 'Stable profession',
    lookingForLocation: 'Sri Lanka or overseas',
    qualities: 'Respectful, honest, and kind',
    notes: 'Demo advert created by the Prisma seed.',
  }
}

function advertData(userId, index) {
  return {
    id: `seed-advert-${index + 1}`,
    userId,
    title: `Demo proposal for ${firstNames[index]} ${lastNames[index]}`,
    content: `Demo proposal for ${firstNames[index]} from ${locations[index]}. The candidate is ${24 + index} years old, works as a ${jobs[index]}, and welcomes a respectful family-oriented match through Spandha.`,
    builderData: advertBuilderData(index),
    isActive: index % 5 !== 0,
    expiresAt: new Date(Date.now() + (21 + index) * 24 * 60 * 60 * 1000),
  }
}

function contentBlocks() {
  return [
    {
      key: 'hero',
      locale: Locale.EN,
      type: BlockType.HERO,
      content: { title: 'Find Your Perfect', subtitle: 'Life Partner', cta: 'Get Started' },
    },
    {
      key: 'hero',
      locale: Locale.SI,
      type: BlockType.HERO,
      content: { title: 'Find a Trusted', subtitle: 'Marriage Match', cta: 'Start Today' },
    },
    ...Array.from({ length: 5 }, (_, index) => ({
      key: `seed-banner-${index + 1}`,
      locale: Locale.EN,
      type: BlockType.BANNER,
      content: {
        imageUrl: '/images/hero-bg.png',
        link: '/proposals',
        text: `Browse verified demo profiles ${index + 1}`,
      },
    })),
    ...Array.from({ length: 5 }, (_, index) => ({
      key: `seed-advert-block-${index + 1}`,
      locale: index % 2 === 0 ? Locale.EN : Locale.SI,
      type: BlockType.ADVERT,
      content: {
        title: `Featured demo match ${index + 1}`,
        image: '/images/hero-bg.png',
        link: '/proposals',
      },
    })),
  ]
}

async function seedUsers() {
  const users = []

  for (let index = 0; index < 12; index += 1) {
    const email = index === 0 ? 'admin@spandha.com' : `seed.member.${index + 1}@spandha.test`
    const phone = index === 0 ? '+94774641482' : `+9477000${String(index + 1).padStart(3, '0')}`
    const isVerified = index === 0 ? true : index % 4 !== 0
    const isPremium = index === 0 ? true : index % 3 === 0
    const isAdmin = index === 0

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        phone,
        isVerified,
        isPremium,
        isAdmin,
      },
      create: {
        email,
        phone,
        isVerified,
        isPremium,
        isAdmin,
      },
    })

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: profileData(index),
      create: {
        userId: user.id,
        ...profileData(index),
      },
    })

    await prisma.preferences.upsert({
      where: { userId: user.id },
      update: preferenceData(index),
      create: {
        userId: user.id,
        ...preferenceData(index),
      },
    })

    users.push(user)
  }

  return users
}

async function seedAdverts(users) {
  for (let index = 0; index < users.length; index += 1) {
    const data = advertData(users[index].id, index)

    await prisma.advert.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    })
  }
}

async function seedInterests(users) {
  for (let index = 0; index < 12; index += 1) {
    const fromUserId = users[index].id
    const toUserId = users[(index + 3) % users.length].id
    const status = Object.values(InterestStatus)[index % 3]

    await prisma.interest.upsert({
      where: {
        fromUserId_toUserId: { fromUserId, toUserId },
      },
      update: { status },
      create: { fromUserId, toUserId, status },
    })
  }
}

async function seedContentBlocks() {
  for (const block of contentBlocks()) {
    await prisma.contentBlock.upsert({
      where: {
        key_locale: {
          key: block.key,
          locale: block.locale,
        },
      },
      update: {
        type: block.type,
        content: JSON.stringify(block.content),
        isActive: true,
      },
      create: {
        key: block.key,
        locale: block.locale,
        type: block.type,
        content: JSON.stringify(block.content),
        isActive: true,
      },
    })
  }
}

async function main() {
  console.log('Cleaning up existing seed data...')
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: 'admin@spandha.com' },
        { phone: '+94774641482' },
        { email: { endsWith: '@spandha.test' } },
        { phone: { startsWith: '+9477000' } }
      ]
    }
  })

  console.log('Seeding database...')
  const users = await seedUsers()

  await seedAdverts(users)
  await seedInterests(users)
  await seedContentBlocks()

  console.log('Seeded 12 users, profiles, preferences, adverts, interests, and content blocks.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
