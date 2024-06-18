\echo 'Delete and recreate speller db?'
\prompt 'Return for yes or control-C to cancel > ' foo


DROP DATABASE speller;
CREATE DATABASE speller;
\connect speller

\i speller-schema.sql
\i speller-seed.sql

\echo 'Delete and recreate speller_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE speller_test;
CREATE DATABASE speller_test;
\connect speller_test

\i speller-schema.sql