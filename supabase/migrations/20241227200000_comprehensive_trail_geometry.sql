-- ========================================
-- COMPREHENSIVE TRAIL GEOMETRY DATA
-- Trail paths for all 58 Colorado 14ers
-- Generated paths based on route data
-- ========================================

-- ========================================
-- SAWATCH RANGE PEAKS
-- ========================================

-- Mt. Massive - East Slopes
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.3964, 39.1747, 10080],
    [-106.3980, 39.1760, 10250],
    [-106.4010, 39.1775, 10500],
    [-106.4040, 39.1790, 10800],
    [-106.4070, 39.1805, 11100],
    [-106.4100, 39.1820, 11400],
    [-106.4130, 39.1835, 11700],
    [-106.4160, 39.1848, 12000],
    [-106.4200, 39.1855, 12350],
    [-106.4250, 39.1860, 12700],
    [-106.4300, 39.1862, 13050],
    [-106.4350, 39.1865, 13400],
    [-106.4400, 39.1868, 13700],
    [-106.4500, 39.1870, 14000],
    [-106.4600, 39.1872, 14200],
    [-106.4700, 39.1874, 14350],
    [-106.4756, 39.1875, 14428]
  ],
  "properties": {
    "elevationGain": 4500,
    "elevationLoss": 152,
    "minElevation": 10080,
    "maxElevation": 14428,
    "totalDistanceMiles": 7.0
  }
}'::jsonb
WHERE slug = 'east-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-massive');

-- Mt. Harvard - South Slopes
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.2622, 38.8664, 9880],
    [-106.2650, 38.8700, 10100],
    [-106.2680, 38.8740, 10400],
    [-106.2720, 38.8780, 10750],
    [-106.2760, 38.8820, 11100],
    [-106.2800, 38.8860, 11450],
    [-106.2840, 38.8900, 11800],
    [-106.2880, 38.8940, 12150],
    [-106.2920, 38.8980, 12500],
    [-106.2960, 38.9020, 12850],
    [-106.3000, 38.9060, 13200],
    [-106.3050, 38.9100, 13500],
    [-106.3100, 38.9140, 13800],
    [-106.3150, 38.9180, 14100],
    [-106.3206, 38.9244, 14420]
  ],
  "properties": {
    "elevationGain": 4500,
    "elevationLoss": 0,
    "minElevation": 9880,
    "maxElevation": 14420,
    "totalDistanceMiles": 7.0
  }
}'::jsonb
WHERE slug = 'south-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-harvard');

-- La Plata Peak - Northwest Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.5136, 39.0269, 10000],
    [-106.5100, 39.0275, 10300],
    [-106.5060, 39.0280, 10650],
    [-106.5020, 39.0285, 11000],
    [-106.4980, 39.0288, 11350],
    [-106.4940, 39.0290, 11700],
    [-106.4900, 39.0292, 12050],
    [-106.4860, 39.0293, 12400],
    [-106.4820, 39.0294, 12750],
    [-106.4780, 39.0294, 13100],
    [-106.4750, 39.0294, 13450],
    [-106.4731, 39.0294, 14336]
  ],
  "properties": {
    "elevationGain": 4500,
    "elevationLoss": 164,
    "minElevation": 10000,
    "maxElevation": 14336,
    "totalDistanceMiles": 4.5
  }
}'::jsonb
WHERE slug = 'northwest-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'la-plata-peak');

-- Mt. Antero - West Slopes (short hike from upper TH)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.2794, 38.6783, 12380],
    [-106.2750, 38.6770, 12600],
    [-106.2700, 38.6760, 12850],
    [-106.2650, 38.6750, 13100],
    [-106.2600, 38.6745, 13400],
    [-106.2550, 38.6743, 13700],
    [-106.2500, 38.6742, 14000],
    [-106.2461, 38.6742, 14269]
  ],
  "properties": {
    "elevationGain": 1900,
    "elevationLoss": 11,
    "minElevation": 12380,
    "maxElevation": 14269,
    "totalDistanceMiles": 1.75
  }
}'::jsonb
WHERE slug = 'west-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-antero');

-- Mt. Shavano - East Slopes
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.1942, 38.6111, 9700],
    [-106.1980, 38.6120, 10000],
    [-106.2020, 38.6130, 10350],
    [-106.2060, 38.6140, 10700],
    [-106.2100, 38.6150, 11050],
    [-106.2140, 38.6160, 11400],
    [-106.2180, 38.6170, 11750],
    [-106.2220, 38.6180, 12100],
    [-106.2260, 38.6188, 12500],
    [-106.2300, 38.6190, 12900],
    [-106.2340, 38.6192, 13300],
    [-106.2392, 38.6192, 14229]
  ],
  "properties": {
    "elevationGain": 4600,
    "elevationLoss": 71,
    "minElevation": 9700,
    "maxElevation": 14229,
    "totalDistanceMiles": 5.0
  }
}'::jsonb
WHERE slug = 'east-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-shavano');

-- Mt. Belford - Northwest Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.3606, 38.9856, 9760],
    [-106.3600, 38.9800, 10100],
    [-106.3598, 38.9750, 10500],
    [-106.3596, 38.9700, 10900],
    [-106.3594, 38.9660, 11300],
    [-106.3592, 38.9640, 11700],
    [-106.3600, 38.9625, 12100],
    [-106.3605, 38.9615, 12500],
    [-106.3606, 38.9610, 12900],
    [-106.3606, 38.9608, 14197]
  ],
  "properties": {
    "elevationGain": 4400,
    "elevationLoss": 0,
    "minElevation": 9760,
    "maxElevation": 14197,
    "totalDistanceMiles": 4.0
  }
}'::jsonb
WHERE slug = 'northwest-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-belford');

-- Mt. Princeton - East Slopes
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.1928, 38.7447, 8900],
    [-106.1980, 38.7460, 9200],
    [-106.2030, 38.7470, 9600],
    [-106.2080, 38.7478, 10000],
    [-106.2130, 38.7485, 10450],
    [-106.2180, 38.7490, 10900],
    [-106.2230, 38.7492, 11350],
    [-106.2280, 38.7493, 11800],
    [-106.2330, 38.7493, 12300],
    [-106.2380, 38.7492, 12800],
    [-106.2422, 38.7492, 14197]
  ],
  "properties": {
    "elevationGain": 4200,
    "elevationLoss": 0,
    "minElevation": 8900,
    "maxElevation": 14197,
    "totalDistanceMiles": 3.75
  }
}'::jsonb
WHERE slug = 'east-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-princeton');

-- Mt. Yale - Southwest Slopes
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.3133, 38.8175, 9900],
    [-106.3130, 38.8200, 10200],
    [-106.3128, 38.8230, 10550],
    [-106.3126, 38.8260, 10900],
    [-106.3130, 38.8290, 11250],
    [-106.3135, 38.8320, 11600],
    [-106.3137, 38.8350, 11950],
    [-106.3138, 38.8380, 12350],
    [-106.3139, 38.8410, 12750],
    [-106.3139, 38.8442, 14196]
  ],
  "properties": {
    "elevationGain": 4300,
    "elevationLoss": 4,
    "minElevation": 9900,
    "maxElevation": 14196,
    "totalDistanceMiles": 4.5
  }
}'::jsonb
WHERE slug = 'southwest-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-yale');

-- Tabeguache Peak - Via Shavano
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.1942, 38.6111, 9700],
    [-106.1980, 38.6120, 10050],
    [-106.2020, 38.6130, 10400],
    [-106.2060, 38.6140, 10750],
    [-106.2100, 38.6150, 11100],
    [-106.2140, 38.6160, 11450],
    [-106.2180, 38.6170, 11800],
    [-106.2220, 38.6180, 12200],
    [-106.2280, 38.6188, 12700],
    [-106.2350, 38.6192, 13300],
    [-106.2392, 38.6192, 14229],
    [-106.2420, 38.6210, 13900],
    [-106.2450, 38.6230, 13600],
    [-106.2480, 38.6245, 13800],
    [-106.2508, 38.6256, 14155]
  ],
  "properties": {
    "elevationGain": 5600,
    "elevationLoss": 1145,
    "minElevation": 9700,
    "maxElevation": 14229,
    "totalDistanceMiles": 6.0
  }
}'::jsonb
WHERE slug = 'via-shavano'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'tabeguache-peak');

-- Mt. Oxford - Via Belford
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.3606, 38.9856, 9760],
    [-106.3600, 38.9800, 10150],
    [-106.3598, 38.9750, 10600],
    [-106.3596, 38.9700, 11050],
    [-106.3594, 38.9660, 11500],
    [-106.3600, 38.9625, 12000],
    [-106.3606, 38.9608, 14197],
    [-106.3550, 38.9615, 13800],
    [-106.3500, 38.9625, 13500],
    [-106.3450, 38.9635, 13700],
    [-106.3400, 38.9645, 14000],
    [-106.3383, 38.9647, 14153]
  ],
  "properties": {
    "elevationGain": 5200,
    "elevationLoss": 808,
    "minElevation": 9760,
    "maxElevation": 14197,
    "totalDistanceMiles": 5.0
  }
}'::jsonb
WHERE slug = 'via-belford'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-oxford');

-- Mt. Columbia - West Slopes
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.3458, 38.9028, 9400],
    [-106.3420, 38.9030, 9750],
    [-106.3380, 38.9032, 10150],
    [-106.3340, 38.9034, 10550],
    [-106.3300, 38.9035, 10950],
    [-106.3260, 38.9036, 11400],
    [-106.3220, 38.9037, 11850],
    [-106.3180, 38.9038, 12300],
    [-106.3120, 38.9038, 12800],
    [-106.3060, 38.9039, 13300],
    [-106.3000, 38.9039, 13800],
    [-106.2975, 38.9039, 14073]
  ],
  "properties": {
    "elevationGain": 4500,
    "elevationLoss": 0,
    "minElevation": 9400,
    "maxElevation": 14073,
    "totalDistanceMiles": 5.5
  }
}'::jsonb
WHERE slug = 'west-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-columbia');

-- Missouri Mountain - Northwest Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.3606, 38.9856, 9760],
    [-106.3620, 38.9800, 10150],
    [-106.3640, 38.9750, 10600],
    [-106.3660, 38.9700, 11050],
    [-106.3680, 38.9650, 11500],
    [-106.3700, 38.9600, 11950],
    [-106.3720, 38.9560, 12400],
    [-106.3740, 38.9530, 12850],
    [-106.3760, 38.9500, 13300],
    [-106.3780, 38.9480, 13750],
    [-106.3781, 38.9475, 14067]
  ],
  "properties": {
    "elevationGain": 4600,
    "elevationLoss": 293,
    "minElevation": 9760,
    "maxElevation": 14067,
    "totalDistanceMiles": 5.0
  }
}'::jsonb
WHERE slug = 'northwest-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'missouri-mountain');

-- Mt. of the Holy Cross - North Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.4289, 39.4447, 10300],
    [-106.4350, 39.4480, 10700],
    [-106.4400, 39.4510, 11100],
    [-106.4450, 39.4550, 11500],
    [-106.4500, 39.4580, 11300],
    [-106.4550, 39.4600, 11000],
    [-106.4600, 39.4620, 11400],
    [-106.4650, 39.4640, 11900],
    [-106.4700, 39.4655, 12400],
    [-106.4750, 39.4665, 12900],
    [-106.4800, 39.4670, 13400],
    [-106.4817, 39.4667, 14005]
  ],
  "properties": {
    "elevationGain": 5600,
    "elevationLoss": 1895,
    "minElevation": 10300,
    "maxElevation": 14005,
    "totalDistanceMiles": 6.0
  }
}'::jsonb
WHERE slug = 'north-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-of-the-holy-cross');

-- Huron Peak - Northwest Slopes
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.4025, 38.9539, 10520],
    [-106.4080, 38.9530, 10850],
    [-106.4140, 38.9520, 11200],
    [-106.4200, 38.9510, 11550],
    [-106.4260, 38.9500, 11900],
    [-106.4300, 38.9490, 12300],
    [-106.4340, 38.9475, 12700],
    [-106.4360, 38.9460, 13100],
    [-106.4370, 38.9455, 13600],
    [-106.4375, 38.9453, 14003]
  ],
  "properties": {
    "elevationGain": 3500,
    "elevationLoss": 17,
    "minElevation": 10520,
    "maxElevation": 14003,
    "totalDistanceMiles": 3.5
  }
}'::jsonb
WHERE slug = 'northwest-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'huron-peak');

-- ========================================
-- ELK MOUNTAINS PEAKS
-- ========================================

-- Castle Peak - Northwest Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.8117, 39.0322, 9800],
    [-106.8180, 39.0300, 10150],
    [-106.8250, 39.0275, 10550],
    [-106.8320, 39.0250, 10950],
    [-106.8380, 39.0220, 11350],
    [-106.8440, 39.0190, 11750],
    [-106.8500, 39.0160, 12200],
    [-106.8540, 39.0135, 12650],
    [-106.8570, 39.0115, 13100],
    [-106.8600, 39.0100, 13600],
    [-106.8614, 39.0097, 14265]
  ],
  "properties": {
    "elevationGain": 4400,
    "elevationLoss": 0,
    "minElevation": 9800,
    "maxElevation": 14265,
    "totalDistanceMiles": 6.0
  }
}'::jsonb
WHERE slug = 'northwest-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'castle-peak');

-- Maroon Peak - South Ridge (Class 3)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.9389, 39.0989, 9580],
    [-106.9450, 39.0950, 9900],
    [-106.9520, 39.0900, 10300],
    [-106.9580, 39.0860, 10750],
    [-106.9640, 39.0820, 11200],
    [-106.9700, 39.0790, 11650],
    [-106.9750, 39.0760, 12100],
    [-106.9800, 39.0740, 12600],
    [-106.9850, 39.0720, 13100],
    [-106.9880, 39.0710, 13600],
    [-106.9889, 39.0708, 14156]
  ],
  "properties": {
    "elevationGain": 4400,
    "elevationLoss": 0,
    "minElevation": 9580,
    "maxElevation": 14156,
    "totalDistanceMiles": 5.0
  }
}'::jsonb
WHERE slug = 'south-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'maroon-peak');

-- Pyramid Peak - Northeast Ridge (Class 4)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.9389, 39.0989, 9580],
    [-106.9420, 39.0940, 9900],
    [-106.9450, 39.0890, 10300],
    [-106.9470, 39.0840, 10750],
    [-106.9480, 39.0800, 11200],
    [-106.9490, 39.0770, 11700],
    [-106.9495, 39.0750, 12200],
    [-106.9498, 39.0730, 12750],
    [-106.9500, 39.0720, 13300],
    [-106.9500, 39.0714, 14018]
  ],
  "properties": {
    "elevationGain": 4500,
    "elevationLoss": 62,
    "minElevation": 9580,
    "maxElevation": 14018,
    "totalDistanceMiles": 4.25
  }
}'::jsonb
WHERE slug = 'northeast-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'pyramid-peak');

-- North Maroon Peak - Northeast Ridge (Class 4)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.9389, 39.0989, 9580],
    [-106.9450, 39.0960, 9900],
    [-106.9520, 39.0930, 10300],
    [-106.9580, 39.0900, 10750],
    [-106.9640, 39.0870, 11200],
    [-106.9700, 39.0840, 11700],
    [-106.9750, 39.0815, 12200],
    [-106.9800, 39.0795, 12700],
    [-106.9840, 39.0775, 13250],
    [-106.9865, 39.0765, 13750],
    [-106.9872, 39.0761, 14014]
  ],
  "properties": {
    "elevationGain": 4600,
    "elevationLoss": 166,
    "minElevation": 9580,
    "maxElevation": 14014,
    "totalDistanceMiles": 5.0
  }
}'::jsonb
WHERE slug = 'northeast-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'north-maroon-peak');

-- Snowmass Mountain - East Slopes
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.0003, 39.1431, 8380],
    [-107.0100, 39.1400, 8800],
    [-107.0200, 39.1370, 9250],
    [-107.0300, 39.1340, 9700],
    [-107.0400, 39.1310, 10200],
    [-107.0480, 39.1280, 10700],
    [-107.0540, 39.1250, 11200],
    [-107.0580, 39.1230, 11700],
    [-107.0620, 39.1210, 12250],
    [-107.0650, 39.1195, 12800],
    [-107.0664, 39.1189, 14092]
  ],
  "properties": {
    "elevationGain": 5400,
    "elevationLoss": 0,
    "minElevation": 8380,
    "maxElevation": 14092,
    "totalDistanceMiles": 8.0
  }
}'::jsonb
WHERE slug = 'east-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'snowmass-mountain');

-- Conundrum Peak - Via Castle Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.8117, 39.0322, 9800],
    [-106.8180, 39.0300, 10200],
    [-106.8250, 39.0275, 10650],
    [-106.8320, 39.0250, 11100],
    [-106.8380, 39.0220, 11550],
    [-106.8440, 39.0190, 12000],
    [-106.8500, 39.0160, 12500],
    [-106.8560, 39.0130, 13000],
    [-106.8600, 39.0100, 13500],
    [-106.8614, 39.0097, 14265],
    [-106.8620, 39.0120, 13900],
    [-106.8625, 39.0140, 13700],
    [-106.8631, 39.0147, 14060]
  ],
  "properties": {
    "elevationGain": 4700,
    "elevationLoss": 440,
    "minElevation": 9800,
    "maxElevation": 14265,
    "totalDistanceMiles": 6.5
  }
}'::jsonb
WHERE slug = 'via-castle'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'conundrum-peak');

-- Capitol Peak - Standard Route (already exists pilot peak)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.0833, 39.1528, 9450],
    [-107.0800, 39.1500, 9800],
    [-107.0760, 39.1470, 10200],
    [-107.0720, 39.1440, 10650],
    [-107.0680, 39.1410, 11100],
    [-107.0640, 39.1380, 11550],
    [-107.0600, 39.1350, 12000],
    [-107.0560, 39.1320, 12500],
    [-107.0520, 39.1290, 13000],
    [-107.0480, 39.1260, 13500],
    [-107.0450, 39.1235, 14000],
    [-107.0833, 39.1500, 14130]
  ],
  "properties": {
    "elevationGain": 5000,
    "elevationLoss": 320,
    "minElevation": 9450,
    "maxElevation": 14130,
    "totalDistanceMiles": 8.5
  }
}'::jsonb
WHERE slug = 'knife-edge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'capitol-peak');

-- ========================================
-- SAN JUAN MOUNTAINS PEAKS
-- ========================================

-- Uncompahgre Peak - South Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.4500, 38.0500, 11400],
    [-107.4520, 38.0540, 11700],
    [-107.4540, 38.0580, 12050],
    [-107.4560, 38.0620, 12400],
    [-107.4580, 38.0655, 12750],
    [-107.4600, 38.0685, 13150],
    [-107.4615, 38.0705, 13600],
    [-107.4622, 38.0717, 14309]
  ],
  "properties": {
    "elevationGain": 3000,
    "elevationLoss": 91,
    "minElevation": 11400,
    "maxElevation": 14309,
    "totalDistanceMiles": 3.75
  }
}'::jsonb
WHERE slug = 'south-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'uncompahgre-peak');

-- Mt. Wilson - North Slopes (Class 4)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.9333, 37.8417, 9300],
    [-107.9400, 37.8420, 9700],
    [-107.9500, 37.8415, 10200],
    [-107.9600, 37.8410, 10700],
    [-107.9700, 37.8405, 11250],
    [-107.9780, 37.8400, 11800],
    [-107.9840, 37.8398, 12350],
    [-107.9880, 37.8395, 12900],
    [-107.9900, 37.8393, 13500],
    [-107.9911, 37.8392, 14246]
  ],
  "properties": {
    "elevationGain": 4900,
    "elevationLoss": 0,
    "minElevation": 9300,
    "maxElevation": 14246,
    "totalDistanceMiles": 6.0
  }
}'::jsonb
WHERE slug = 'north-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-wilson');

-- Mt. Eolus - Northeast Ridge (Class 3)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.6917, 37.6350, 8212],
    [-107.6800, 37.6330, 8600],
    [-107.6700, 37.6310, 9100],
    [-107.6600, 37.6290, 9650],
    [-107.6500, 37.6275, 10200],
    [-107.6400, 37.6260, 10800],
    [-107.6350, 37.6245, 11400],
    [-107.6300, 37.6235, 12000],
    [-107.6260, 37.6225, 12650],
    [-107.6230, 37.6220, 13300],
    [-107.6225, 37.6219, 14083]
  ],
  "properties": {
    "elevationGain": 5500,
    "elevationLoss": 0,
    "minElevation": 8212,
    "maxElevation": 14083,
    "totalDistanceMiles": 7.0
  }
}'::jsonb
WHERE slug = 'northeast-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-eolus');

-- Windom Peak - West Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.6917, 37.6350, 8212],
    [-107.6800, 37.6330, 8650],
    [-107.6700, 37.6310, 9150],
    [-107.6600, 37.6290, 9700],
    [-107.6400, 37.6250, 10300],
    [-107.6200, 37.6220, 10900],
    [-107.6050, 37.6215, 11550],
    [-107.5980, 37.6212, 12200],
    [-107.5940, 37.6211, 12900],
    [-107.5917, 37.6211, 14082]
  ],
  "properties": {
    "elevationGain": 5100,
    "elevationLoss": 230,
    "minElevation": 8212,
    "maxElevation": 14082,
    "totalDistanceMiles": 7.0
  }
}'::jsonb
WHERE slug = 'west-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'windom-peak');

-- Sunlight Peak - South Slopes (Class 4)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.6917, 37.6350, 8212],
    [-107.6800, 37.6330, 8700],
    [-107.6700, 37.6315, 9250],
    [-107.6550, 37.6295, 9850],
    [-107.6400, 37.6280, 10450],
    [-107.6250, 37.6275, 11100],
    [-107.6100, 37.6272, 11750],
    [-107.6020, 37.6272, 12400],
    [-107.5980, 37.6272, 13100],
    [-107.5958, 37.6272, 14059]
  ],
  "properties": {
    "elevationGain": 5300,
    "elevationLoss": 453,
    "minElevation": 8212,
    "maxElevation": 14059,
    "totalDistanceMiles": 7.0
  }
}'::jsonb
WHERE slug = 'south-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'sunlight-peak');

-- Wilson Peak - West Ridge (Class 3)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.9872, 37.8683, 10250],
    [-107.9860, 37.8660, 10600],
    [-107.9850, 37.8640, 11000],
    [-107.9845, 37.8620, 11450],
    [-107.9842, 37.8605, 11900],
    [-107.9840, 37.8600, 12400],
    [-107.9839, 37.8598, 12950],
    [-107.9839, 37.8597, 14017]
  ],
  "properties": {
    "elevationGain": 4400,
    "elevationLoss": 633,
    "minElevation": 10250,
    "maxElevation": 14017,
    "totalDistanceMiles": 5.0
  }
}'::jsonb
WHERE slug = 'west-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'wilson-peak');

-- El Diente Peak - North Slopes (Class 3)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-108.0269, 37.8525, 10060],
    [-108.0240, 37.8500, 10400],
    [-108.0200, 37.8475, 10850],
    [-108.0160, 37.8450, 11300],
    [-108.0120, 37.8430, 11800],
    [-108.0100, 37.8415, 12300],
    [-108.0080, 37.8405, 12850],
    [-108.0060, 37.8395, 13400],
    [-108.0053, 37.8392, 14159]
  ],
  "properties": {
    "elevationGain": 4500,
    "elevationLoss": 401,
    "minElevation": 10060,
    "maxElevation": 14159,
    "totalDistanceMiles": 5.5
  }
}'::jsonb
WHERE slug = 'north-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'el-diente-peak');

-- San Luis Peak - Stewart Creek
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.9083, 37.9308, 10480],
    [-106.9120, 37.9350, 10750],
    [-106.9150, 37.9400, 11050],
    [-106.9180, 37.9450, 11350],
    [-106.9210, 37.9500, 11700],
    [-106.9240, 37.9550, 12050],
    [-106.9270, 37.9600, 12400],
    [-106.9290, 37.9650, 12800],
    [-106.9300, 37.9700, 13200],
    [-106.9305, 37.9750, 13600],
    [-106.9311, 37.9869, 14014]
  ],
  "properties": {
    "elevationGain": 3600,
    "elevationLoss": 66,
    "minElevation": 10480,
    "maxElevation": 14014,
    "totalDistanceMiles": 5.5
  }
}'::jsonb
WHERE slug = 'stewart-creek'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'san-luis-peak');

-- Wetterhorn Peak - Southeast Ridge (Class 3)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.4906, 38.0658, 10800],
    [-107.4920, 38.0640, 11100],
    [-107.4950, 38.0625, 11450],
    [-107.4980, 38.0615, 11800],
    [-107.5020, 38.0608, 12200],
    [-107.5060, 38.0605, 12650],
    [-107.5090, 38.0604, 13100],
    [-107.5108, 38.0606, 14015]
  ],
  "properties": {
    "elevationGain": 3300,
    "elevationLoss": 85,
    "minElevation": 10800,
    "maxElevation": 14015,
    "totalDistanceMiles": 3.5
  }
}'::jsonb
WHERE slug = 'southeast-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'wetterhorn-peak');

-- Redcloud Peak - Silver Creek
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.3833, 37.9333, 10400],
    [-107.3880, 37.9350, 10750],
    [-107.3930, 37.9365, 11100],
    [-107.3980, 37.9378, 11500],
    [-107.4030, 37.9388, 11900],
    [-107.4080, 37.9395, 12350],
    [-107.4130, 37.9400, 12800],
    [-107.4180, 37.9405, 13300],
    [-107.4217, 37.9408, 14034]
  ],
  "properties": {
    "elevationGain": 3700,
    "elevationLoss": 66,
    "minElevation": 10400,
    "maxElevation": 14034,
    "totalDistanceMiles": 4.5
  }
}'::jsonb
WHERE slug = 'silver-creek'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'redcloud-peak');

-- Sunshine Peak - Via Redcloud Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.3833, 37.9333, 10400],
    [-107.3880, 37.9350, 10800],
    [-107.3930, 37.9365, 11200],
    [-107.3980, 37.9378, 11650],
    [-107.4030, 37.9388, 12100],
    [-107.4080, 37.9395, 12600],
    [-107.4130, 37.9400, 13100],
    [-107.4180, 37.9405, 13600],
    [-107.4217, 37.9408, 14034],
    [-107.4230, 37.9350, 13700],
    [-107.4245, 37.9290, 13500],
    [-107.4253, 37.9228, 14001]
  ],
  "properties": {
    "elevationGain": 4500,
    "elevationLoss": 899,
    "minElevation": 10400,
    "maxElevation": 14034,
    "totalDistanceMiles": 5.5
  }
}'::jsonb
WHERE slug = 'via-redcloud'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'sunshine-peak');

-- Handies Peak - Standard Route (pilot peak)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.5017, 37.9133, 10800],
    [-107.5050, 37.9150, 11150],
    [-107.5080, 37.9165, 11500],
    [-107.5110, 37.9180, 11900],
    [-107.5140, 37.9195, 12300],
    [-107.5170, 37.9210, 12750],
    [-107.5200, 37.9228, 13200],
    [-107.5220, 37.9245, 13700],
    [-107.5044, 37.9131, 14048]
  ],
  "properties": {
    "elevationGain": 3400,
    "elevationLoss": 152,
    "minElevation": 10800,
    "maxElevation": 14048,
    "totalDistanceMiles": 5.5
  }
}'::jsonb
WHERE slug = 'west-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'handies-peak');

-- Mt. Sneffels - Standard Route (pilot peak)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.7714, 38.0028, 10800],
    [-107.7750, 38.0050, 11150],
    [-107.7790, 38.0075, 11550],
    [-107.7830, 38.0095, 12000],
    [-107.7870, 38.0110, 12450],
    [-107.7900, 38.0125, 12950],
    [-107.7920, 38.0140, 13450],
    [-107.7933, 38.0039, 14150]
  ],
  "properties": {
    "elevationGain": 3500,
    "elevationLoss": 150,
    "minElevation": 10800,
    "maxElevation": 14150,
    "totalDistanceMiles": 6.0
  }
}'::jsonb
WHERE slug = 'lavender-couloir'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-sneffels');

-- North Eolus - Via Eolus
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-107.6917, 37.6350, 8212],
    [-107.6800, 37.6330, 8650],
    [-107.6700, 37.6310, 9200],
    [-107.6600, 37.6290, 9800],
    [-107.6500, 37.6275, 10400],
    [-107.6400, 37.6260, 11050],
    [-107.6350, 37.6245, 11700],
    [-107.6300, 37.6235, 12400],
    [-107.6260, 37.6225, 13100],
    [-107.6225, 37.6219, 14083],
    [-107.6210, 37.6235, 13850],
    [-107.6206, 37.6247, 14039]
  ],
  "properties": {
    "elevationGain": 5600,
    "elevationLoss": 267,
    "minElevation": 8212,
    "maxElevation": 14083,
    "totalDistanceMiles": 7.0
  }
}'::jsonb
WHERE slug = 'via-eolus'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'north-eolus');

-- ========================================
-- SANGRE DE CRISTO RANGE PEAKS
-- ========================================

-- Blanca Peak - Northwest Face
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.5369, 37.5614, 8050],
    [-105.5350, 37.5640, 8500],
    [-105.5320, 37.5670, 9050],
    [-105.5280, 37.5695, 9600],
    [-105.5240, 37.5715, 10200],
    [-105.5200, 37.5735, 10850],
    [-105.5100, 37.5750, 11500],
    [-105.5000, 37.5760, 12200],
    [-105.4920, 37.5770, 12950],
    [-105.4870, 37.5775, 13700],
    [-105.4856, 37.5775, 14345]
  ],
  "properties": {
    "elevationGain": 5500,
    "elevationLoss": 0,
    "minElevation": 8050,
    "maxElevation": 14345,
    "totalDistanceMiles": 7.0
  }
}'::jsonb
WHERE slug = 'northwest-face'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'blanca-peak');

-- Crestone Peak - South Face (Class 3)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.5381, 37.9403, 9050],
    [-105.5420, 37.9450, 9500],
    [-105.5470, 37.9500, 10050],
    [-105.5520, 37.9540, 10600],
    [-105.5570, 37.9575, 11200],
    [-105.5620, 37.9600, 11800],
    [-105.5680, 37.9620, 12450],
    [-105.5740, 37.9640, 13100],
    [-105.5800, 37.9655, 13750],
    [-105.5856, 37.9669, 14294]
  ],
  "properties": {
    "elevationGain": 5600,
    "elevationLoss": 356,
    "minElevation": 9050,
    "maxElevation": 14294,
    "totalDistanceMiles": 6.5
  }
}'::jsonb
WHERE slug = 'south-face'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'crestone-peak');

-- Crestone Needle - South Face (Class 3)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.5381, 37.9403, 9050],
    [-105.5400, 37.9440, 9500],
    [-105.5430, 37.9480, 10000],
    [-105.5460, 37.9520, 10550],
    [-105.5500, 37.9555, 11100],
    [-105.5540, 37.9585, 11700],
    [-105.5580, 37.9610, 12300],
    [-105.5630, 37.9630, 12950],
    [-105.5700, 37.9642, 13600],
    [-105.5767, 37.9647, 14197]
  ],
  "properties": {
    "elevationGain": 5500,
    "elevationLoss": 353,
    "minElevation": 9050,
    "maxElevation": 14197,
    "totalDistanceMiles": 6.5
  }
}'::jsonb
WHERE slug = 'south-face'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'crestone-needle');

-- Kit Carson Peak - Outward Bound Couloir (Class 3)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.5506, 37.9858, 8900],
    [-105.5540, 37.9850, 9350],
    [-105.5580, 37.9840, 9850],
    [-105.5620, 37.9830, 10400],
    [-105.5660, 37.9820, 10950],
    [-105.5700, 37.9815, 11550],
    [-105.5760, 37.9810, 12150],
    [-105.5820, 37.9805, 12800],
    [-105.5900, 37.9800, 13450],
    [-105.6028, 37.9797, 14165]
  ],
  "properties": {
    "elevationGain": 5200,
    "elevationLoss": 0,
    "minElevation": 8900,
    "maxElevation": 14165,
    "totalDistanceMiles": 6.0
  }
}'::jsonb
WHERE slug = 'outward-bound'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'kit-carson-peak');

-- Challenger Point - North Slopes
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.5506, 37.9858, 8900],
    [-105.5550, 37.9855, 9350],
    [-105.5600, 37.9850, 9850],
    [-105.5650, 37.9845, 10400],
    [-105.5720, 37.9835, 10950],
    [-105.5800, 37.9825, 11550],
    [-105.5880, 37.9815, 12150],
    [-105.5960, 37.9808, 12800],
    [-105.6030, 37.9803, 13500],
    [-105.6067, 37.9803, 14081]
  ],
  "properties": {
    "elevationGain": 4800,
    "elevationLoss": 0,
    "minElevation": 8900,
    "maxElevation": 14081,
    "totalDistanceMiles": 5.5
  }
}'::jsonb
WHERE slug = 'north-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'challenger-point');

-- Humboldt Peak - West Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.5381, 37.9403, 9050],
    [-105.5400, 37.9450, 9500],
    [-105.5420, 37.9500, 10000],
    [-105.5450, 37.9550, 10500],
    [-105.5480, 37.9600, 11050],
    [-105.5510, 37.9650, 11600],
    [-105.5530, 37.9700, 12200],
    [-105.5545, 37.9740, 12850],
    [-105.5553, 37.9761, 14064]
  ],
  "properties": {
    "elevationGain": 4400,
    "elevationLoss": 0,
    "minElevation": 9050,
    "maxElevation": 14064,
    "totalDistanceMiles": 5.5
  }
}'::jsonb
WHERE slug = 'west-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'humboldt-peak');

-- Ellingwood Point - South Face
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.5369, 37.5614, 8050],
    [-105.5350, 37.5650, 8550],
    [-105.5320, 37.5690, 9100],
    [-105.5280, 37.5730, 9700],
    [-105.5240, 37.5760, 10350],
    [-105.5200, 37.5785, 11000],
    [-105.5100, 37.5800, 11700],
    [-105.5000, 37.5815, 12400],
    [-105.4950, 37.5822, 13150],
    [-105.4925, 37.5825, 14042]
  ],
  "properties": {
    "elevationGain": 5200,
    "elevationLoss": 0,
    "minElevation": 8050,
    "maxElevation": 14042,
    "totalDistanceMiles": 7.0
  }
}'::jsonb
WHERE slug = 'south-face'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'ellingwood-point');

-- Mt. Lindsey - North Couloir (Class 3)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.3978, 37.5833, 9700],
    [-105.4020, 37.5835, 10050],
    [-105.4080, 37.5837, 10450],
    [-105.4140, 37.5838, 10900],
    [-105.4200, 37.5839, 11400],
    [-105.4260, 37.5839, 11900],
    [-105.4320, 37.5839, 12450],
    [-105.4380, 37.5839, 13050],
    [-105.4420, 37.5839, 13650],
    [-105.4444, 37.5839, 14042]
  ],
  "properties": {
    "elevationGain": 4500,
    "elevationLoss": 158,
    "minElevation": 9700,
    "maxElevation": 14042,
    "totalDistanceMiles": 4.5
  }
}'::jsonb
WHERE slug = 'north-couloir'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-lindsey');

-- Culebra Peak - Northwest Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.1889, 37.1367, 10700],
    [-105.1880, 37.1340, 11000],
    [-105.1870, 37.1310, 11350],
    [-105.1865, 37.1280, 11700],
    [-105.1862, 37.1250, 12100],
    [-105.1860, 37.1225, 12550],
    [-105.1859, 37.1222, 14047]
  ],
  "properties": {
    "elevationGain": 3400,
    "elevationLoss": 53,
    "minElevation": 10700,
    "maxElevation": 14047,
    "totalDistanceMiles": 4.0
  }
}'::jsonb
WHERE slug = 'northwest-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'culebra-peak');

-- Little Bear Peak - Hourglass (Class 4)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.5369, 37.5614, 8050],
    [-105.5350, 37.5600, 8550],
    [-105.5330, 37.5580, 9100],
    [-105.5310, 37.5570, 9700],
    [-105.5100, 37.5620, 10350],
    [-105.5050, 37.5640, 11000],
    [-105.5010, 37.5655, 11700],
    [-105.4990, 37.5665, 12400],
    [-105.4975, 37.5668, 13150],
    [-105.4972, 37.5667, 14037]
  ],
  "properties": {
    "elevationGain": 4500,
    "elevationLoss": 0,
    "minElevation": 8050,
    "maxElevation": 14037,
    "totalDistanceMiles": 5.5
  }
}'::jsonb
WHERE slug = 'hourglass'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'little-bear-peak');

-- ========================================
-- FRONT RANGE & MOSQUITO RANGE PEAKS
-- ========================================

-- Grays Peak - Standard Route (pilot peak)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.7869, 39.6358, 11280],
    [-105.7850, 39.6340, 11500],
    [-105.7830, 39.6320, 11800],
    [-105.7810, 39.6300, 12150],
    [-105.7790, 39.6285, 12500],
    [-105.7770, 39.6270, 12900],
    [-105.7750, 39.6258, 13300],
    [-105.7730, 39.6248, 13700],
    [-105.7817, 39.6339, 14270]
  ],
  "properties": {
    "elevationGain": 3000,
    "elevationLoss": 10,
    "minElevation": 11280,
    "maxElevation": 14270,
    "totalDistanceMiles": 4.0
  }
}'::jsonb
WHERE slug = 'north-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'grays-peak');

-- Torreys Peak - Standard Route (pilot peak)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.7869, 39.6358, 11280],
    [-105.7850, 39.6340, 11550],
    [-105.7830, 39.6320, 11900],
    [-105.7810, 39.6300, 12300],
    [-105.7800, 39.6350, 12700],
    [-105.7795, 39.6400, 13100],
    [-105.7790, 39.6450, 13550],
    [-105.8200, 39.6428, 14267]
  ],
  "properties": {
    "elevationGain": 3100,
    "elevationLoss": 113,
    "minElevation": 11280,
    "maxElevation": 14267,
    "totalDistanceMiles": 4.5
  }
}'::jsonb
WHERE slug = 'south-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'torreys-peak');

-- Mt. Bierstadt - Standard Route (pilot peak)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.7053, 39.5989, 11669],
    [-105.7080, 39.6000, 11900],
    [-105.7120, 39.6020, 12200],
    [-105.7160, 39.6040, 12550],
    [-105.7200, 39.6055, 12900],
    [-105.7240, 39.6070, 13300],
    [-105.7280, 39.6082, 13700],
    [-105.7106, 39.5828, 14060]
  ],
  "properties": {
    "elevationGain": 2800,
    "elevationLoss": 407,
    "minElevation": 11669,
    "maxElevation": 14060,
    "totalDistanceMiles": 3.5
  }
}'::jsonb
WHERE slug = 'west-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-bierstadt');

-- Longs Peak - Keyhole Route (pilot peak)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.5569, 40.2706, 9400],
    [-105.5600, 40.2680, 9800],
    [-105.5650, 40.2650, 10300],
    [-105.5700, 40.2620, 10850],
    [-105.5750, 40.2590, 11400],
    [-105.5800, 40.2570, 12000],
    [-105.5850, 40.2550, 12600],
    [-105.5890, 40.2540, 13200],
    [-105.6158, 40.2547, 14259]
  ],
  "properties": {
    "elevationGain": 5000,
    "elevationLoss": 141,
    "minElevation": 9400,
    "maxElevation": 14259,
    "totalDistanceMiles": 7.5
  }
}'::jsonb
WHERE slug = 'keyhole-route'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'longs-peak');

-- Quandary Peak - Standard Route (pilot peak)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.1064, 39.3853, 10850],
    [-106.1050, 39.3880, 11150],
    [-106.1030, 39.3910, 11500],
    [-106.1010, 39.3940, 11900],
    [-106.0990, 39.3970, 12300],
    [-106.0975, 39.4000, 12750],
    [-106.0965, 39.4030, 13200],
    [-106.0958, 39.4058, 13700],
    [-106.1064, 39.3972, 14265]
  ],
  "properties": {
    "elevationGain": 3400,
    "elevationLoss": 0,
    "minElevation": 10850,
    "maxElevation": 14265,
    "totalDistanceMiles": 3.5
  }
}'::jsonb
WHERE slug = 'east-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'quandary-peak');

-- Mt. Democrat - Standard Route (pilot peak)
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.1236, 39.3347, 12035],
    [-106.1220, 39.3360, 12300],
    [-106.1200, 39.3375, 12600],
    [-106.1180, 39.3390, 12950],
    [-106.1165, 39.3405, 13300],
    [-106.1155, 39.3420, 13700],
    [-106.1400, 39.3394, 14148]
  ],
  "properties": {
    "elevationGain": 2200,
    "elevationLoss": 87,
    "minElevation": 12035,
    "maxElevation": 14148,
    "totalDistanceMiles": 2.0
  }
}'::jsonb
WHERE slug = 'east-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-democrat');

-- Mt. Evans - Chicago Lakes
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-105.6056, 39.6589, 10600],
    [-105.6100, 39.6550, 10950],
    [-105.6150, 39.6510, 11350],
    [-105.6200, 39.6470, 11750],
    [-105.6250, 39.6430, 12200],
    [-105.6300, 39.6390, 12650],
    [-105.6350, 39.6350, 13150],
    [-105.6400, 39.6100, 13650],
    [-105.6431, 39.5883, 14264]
  ],
  "properties": {
    "elevationGain": 4500,
    "elevationLoss": 836,
    "minElevation": 10600,
    "maxElevation": 14264,
    "totalDistanceMiles": 8.0
  }
}'::jsonb
WHERE slug = 'chicago-lakes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-evans');

-- Pikes Peak - Barr Trail
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-104.9419, 38.8564, 6700],
    [-104.9500, 38.8550, 7200],
    [-104.9600, 38.8530, 7800],
    [-104.9700, 38.8510, 8450],
    [-104.9800, 38.8490, 9150],
    [-104.9900, 38.8475, 9900],
    [-105.0000, 38.8460, 10700],
    [-105.0100, 38.8450, 11500],
    [-105.0200, 38.8440, 12350],
    [-105.0300, 38.8425, 13200],
    [-105.0400, 38.8415, 14000],
    [-105.0442, 38.8408, 14115]
  ],
  "properties": {
    "elevationGain": 7400,
    "elevationLoss": 0,
    "minElevation": 6700,
    "maxElevation": 14115,
    "totalDistanceMiles": 13.0
  }
}'::jsonb
WHERE slug = 'barr-trail'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'pikes-peak');

-- Mt. Lincoln - West Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.1236, 39.3347, 12035],
    [-106.1200, 39.3380, 12350],
    [-106.1180, 39.3420, 12700],
    [-106.1160, 39.3460, 13100],
    [-106.1140, 39.3490, 13550],
    [-106.1120, 39.3510, 14000],
    [-106.1114, 39.3514, 14286]
  ],
  "properties": {
    "elevationGain": 2600,
    "elevationLoss": 349,
    "minElevation": 12035,
    "maxElevation": 14286,
    "totalDistanceMiles": 3.0
  }
}'::jsonb
WHERE slug = 'west-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-lincoln');

-- Mt. Cameron - Via Lincoln Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.1236, 39.3347, 12035],
    [-106.1200, 39.3380, 12400],
    [-106.1170, 39.3420, 12800],
    [-106.1150, 39.3460, 13250],
    [-106.1130, 39.3490, 13750],
    [-106.1114, 39.3514, 14286],
    [-106.1150, 39.3490, 14100],
    [-106.1186, 39.3469, 14238]
  ],
  "properties": {
    "elevationGain": 2400,
    "elevationLoss": 197,
    "minElevation": 12035,
    "maxElevation": 14286,
    "totalDistanceMiles": 3.0
  }
}'::jsonb
WHERE slug = 'via-lincoln'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-cameron');

-- Mt. Bross - Northeast Slopes
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.1236, 39.3347, 12035],
    [-106.1200, 39.3380, 12400],
    [-106.1170, 39.3420, 12850],
    [-106.1150, 39.3460, 13350],
    [-106.1114, 39.3514, 14286],
    [-106.1130, 39.3480, 14050],
    [-106.1100, 39.3420, 13800],
    [-106.1080, 39.3380, 14000],
    [-106.1075, 39.3350, 14172]
  ],
  "properties": {
    "elevationGain": 2800,
    "elevationLoss": 663,
    "minElevation": 12035,
    "maxElevation": 14286,
    "totalDistanceMiles": 3.25
  }
}'::jsonb
WHERE slug = 'northeast-slopes'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-bross');

-- Mt. Sherman - Southwest Ridge
UPDATE routes SET trail_geometry = '{
  "type": "LineString",
  "coordinates": [
    [-106.1364, 39.2239, 11900],
    [-106.1400, 39.2240, 12150],
    [-106.1450, 39.2242, 12450],
    [-106.1500, 39.2245, 12800],
    [-106.1550, 39.2247, 13200],
    [-106.1620, 39.2249, 13650],
    [-106.1697, 39.2250, 14036]
  ],
  "properties": {
    "elevationGain": 2100,
    "elevationLoss": 0,
    "minElevation": 11900,
    "maxElevation": 14036,
    "totalDistanceMiles": 2.5
  }
}'::jsonb
WHERE slug = 'southwest-ridge'
AND peak_id = (SELECT id FROM peaks WHERE slug = 'mt-sherman');
