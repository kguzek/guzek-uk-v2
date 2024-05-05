INSERT INTO `guzek_uk`.`pages` (
    `title_en`,
    `title_pl`,
    `url`,
    `local_url`,
    `admin_only`,
    `should_fetch`
  )
VALUES ('Home', 'Główna', '/', TRUE, FALSE, TRUE),
  (
    'Projects',
    'Projekty',
    '/projects',
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'LiveSeries',
    'LiveSeries',
    '/liveseries',
    TRUE,
    FALSE,
    FALSE
  ),
  (
    'Admin',
    'Administracja',
    '/content-manager',
    TRUE,
    TRUE,
    FALSE
  );