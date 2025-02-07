-- Mevcut şehirler
UPDATE cities SET latitude = 39.9334, longitude = 32.8597 WHERE name = 'Ankara';
UPDATE cities SET latitude = 41.0082, longitude = 28.9784 WHERE name = 'İstanbul';
UPDATE cities SET latitude = 38.4192, longitude = 27.1287 WHERE name = 'İzmir';
-- ... (diğer mevcut şehirler)

-- Eksik şehirler ekleniyor
UPDATE cities SET latitude = 40.7392, longitude = 31.6113 WHERE name = 'Bolu';
UPDATE cities SET latitude = 41.6771, longitude = 26.5557 WHERE name = 'Edirne';
UPDATE cities SET latitude = 41.7355, longitude = 27.2244 WHERE name = 'Kırklareli';
UPDATE cities SET latitude = 36.7184, longitude = 37.1212 WHERE name = 'Kilis';
UPDATE cities SET latitude = 38.7432, longitude = 41.4917 WHERE name = 'Muş';
UPDATE cities SET latitude = 40.9839, longitude = 37.8764 WHERE name = 'Ordu';
UPDATE cities SET latitude = 37.0746, longitude = 36.2464 WHERE name = 'Osmaniye';
UPDATE cities SET latitude = 40.3167, longitude = 36.5500 WHERE name = 'Tokat';
UPDATE cities SET latitude = 40.2552, longitude = 40.2249 WHERE name = 'Bayburt';
