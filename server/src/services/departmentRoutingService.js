import Department from '../models/Department.js';

function normalize(value = '') {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

export async function routeDepartment({
  category,
  aiDepartment,
}) {
  const exactCategoryMatch = await Department.findOne({
    isActive: true,
    supportedCategories: category,
  }).sort({ name: 1 });

  if (exactCategoryMatch) {
    return {
      department: exactCategoryMatch,
      routingReason:
        `Department supports category ${category}`,
    };
  }

  if (aiDepartment) {
    const departments = await Department.find({
      isActive: true,
    });

    const normalizedRecommendation =
      normalize(aiDepartment);

    const aiMatch = departments.find((department) => {
      const normalizedName = normalize(department.name);

      return (
        normalizedName.includes(
          normalizedRecommendation,
        ) ||
        normalizedRecommendation.includes(normalizedName)
      );
    });

    if (aiMatch) {
      return {
        department: aiMatch,
        routingReason:
          `Matched valid AI department recommendation: ${aiDepartment}`,
      };
    }
  }

  const fallbackDepartment = await Department.findOne({
    isActive: true,
    supportedCategories: 'OTHER',
  }).sort({ name: 1 });

  if (fallbackDepartment) {
    return {
      department: fallbackDepartment,
      routingReason:
        'Used department configured for OTHER complaints',
    };
  }

  return {
    department: null,
    routingReason:
      'No active department supports this complaint category',
  };
}