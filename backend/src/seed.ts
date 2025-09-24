import { prisma } from './lib/db'

async function main() {
  const count = await prisma.exercise.count()
  if (count > 0) return
  await prisma.exercise.createMany({ data: [
    { name: 'Barbell Bench Press', description: 'Chest press with barbell on flat bench.', muscleGroup: 'Chest', equipment: 'Barbell', difficulty: 'intermediate', approved: true },
    { name: 'Back Squat', description: 'Barbell squat targeting quads and glutes.', muscleGroup: 'Legs', equipment: 'Barbell', difficulty: 'intermediate', approved: true },
    { name: 'Deadlift', description: 'Hip hinge lifting barbell from floor.', muscleGroup: 'Back', equipment: 'Barbell', difficulty: 'advanced', approved: true },
    { name: 'Pull-Up', description: 'Bodyweight vertical pull.', muscleGroup: 'Back', equipment: 'Pull-up Bar', difficulty: 'intermediate', approved: true },
    { name: 'Overhead Press', description: 'Standing shoulder press with barbell.', muscleGroup: 'Shoulders', equipment: 'Barbell', difficulty: 'intermediate', approved: true },
  ]})
  console.log('Seeded default exercises')
}

main().finally(async () => prisma.$disconnect())


