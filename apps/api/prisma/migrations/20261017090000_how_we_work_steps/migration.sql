-- "How we work" steps confirmed by BRANDVISER (October 2026): Insight, Imagination, Orchestration, Impact.
-- Later changes go through PATCH /api/v1/admin/process-steps/:id.
UPDATE "ProcessStep"
SET "name" = 'Insight',
    "line" = 'The brief, the audience, the budget and the one number that defines success.',
    "detail" = 'The brief, the audience, the budget and the one number that defines success.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "number" = '01';

UPDATE "ProcessStep"
SET "name" = 'Imagination',
    "line" = 'Concept, design, 3D renders and a fully costed plan.',
    "detail" = 'Concept, design, 3D renders and a fully costed plan.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "number" = '02';

UPDATE "ProcessStep"
SET "name" = 'Orchestration',
    "line" = 'Venues, vendors, fabrication, talent and full rehearsals.',
    "detail" = 'Venues, vendors, fabrication, talent and full rehearsals.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "number" = '03';

UPDATE "ProcessStep"
SET "name" = 'Impact',
    "line" = 'An experience that feels effortless in the moment and memorable long after.',
    "detail" = 'An experience that feels effortless in the moment and memorable long after.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "number" = '04';
