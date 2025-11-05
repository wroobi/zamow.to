
-- Seedy produktów fryzjerskich (10 typów x 4 modele)
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'L''Oréal Majirel 6.0', 'Farba do włosów, odcień 6.0, trwała koloryzacja', 29.99, 'SKU-LOREAL-MAJIREL-6-0', false from public.categories where name = 'Farby do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Schwarzkopf Igora Royal 7-77', 'Farba do włosów, odcień 7-77, intensywny kolor', 32.99, 'SKU-IGORA-ROYAL-7-77', false from public.categories where name = 'Farby do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Wella Koleston Perfect 8/0', 'Farba do włosów, odcień 8/0, naturalny blond', 31.50, 'SKU-WELLA-KOLESTON-8-0', false from public.categories where name = 'Farby do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Matrix SoColor 5N', 'Farba do włosów, odcień 5N, głęboki brąz', 28.90, 'SKU-MATRIX-SOCOLOR-5N', false from public.categories where name = 'Farby do włosów';

insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Fox Professional Silver 100m', 'Folia fryzjerska, srebrna, 100 metrów', 19.99, 'SKU-FOX-SILVER-100', false from public.categories where name = 'Folie fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Sibel Aluminium 50m', 'Folia fryzjerska, aluminium, 50 metrów', 14.99, 'SKU-SIBEL-ALU-50', false from public.categories where name = 'Folie fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Comair Color Foil 250szt', 'Folia fryzjerska, 250 arkuszy', 24.50, 'SKU-COMAIR-FOIL-250', false from public.categories where name = 'Folie fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Olivia Garden Pro Foil 100m', 'Folia fryzjerska, profesjonalna, 100 metrów', 22.00, 'SKU-OLIVIA-FOIL-100', false from public.categories where name = 'Folie fryzjerskie';

insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Jaguar A-Line 530', 'Grzebień fryzjerski, antystatyczny, model 530', 9.99, 'SKU-JAGUAR-530', false from public.categories where name = 'Grzebienie fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Olivia Garden Carbon Comb C1', 'Grzebień fryzjerski, karbonowy, model C1', 12.50, 'SKU-OLIVIA-CARBON-C1', false from public.categories where name = 'Grzebienie fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Fox Carbon 101', 'Grzebień fryzjerski, karbonowy, model 101', 8.99, 'SKU-FOX-CARBON-101', false from public.categories where name = 'Grzebienie fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Comair Blue 201', 'Grzebień fryzjerski, niebieski, model 201', 7.50, 'SKU-COMAIR-BLUE-201', false from public.categories where name = 'Grzebienie fryzjerskie';

insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'BaByliss Pro Caruso', 'Suszarka do włosów, profesjonalna, 2000W', 199.00, 'SKU-BABYLISS-CARUSO', false from public.categories where name = 'Suszarki do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Parlux 3800 Eco', 'Suszarka do włosów, ekologiczna, 2100W', 249.00, 'SKU-PARLUX-3800', false from public.categories where name = 'Suszarki do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Fox Smart', 'Suszarka do włosów, kompaktowa, 1800W', 159.00, 'SKU-FOX-SMART', false from public.categories where name = 'Suszarki do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Moser Protect', 'Suszarka do włosów, ochrona włosów, 1500W', 139.00, 'SKU-MOSER-PROTECT', false from public.categories where name = 'Suszarki do włosów';

insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Jaguar Pre Style Ergo', 'Nożyczki fryzjerskie, ergonomiczne, 5.5"', 119.00, 'SKU-JAGUAR-ERGO', false from public.categories where name = 'Nożyczki fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Kasho Design Master', 'Nożyczki fryzjerskie, japońska stal, 6.0"', 299.00, 'SKU-KASHO-DESIGN', false from public.categories where name = 'Nożyczki fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Fox Master', 'Nożyczki fryzjerskie, stal nierdzewna, 5.0"', 89.00, 'SKU-FOX-MASTER', false from public.categories where name = 'Nożyczki fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Tondeo S-Line', 'Nożyczki fryzjerskie, niemiecka jakość, 5.5"', 179.00, 'SKU-TONDEO-SLINE', false from public.categories where name = 'Nożyczki fryzjerskie';

insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Wahl Super Taper', 'Maszynka do strzyżenia, profesjonalna, przewodowa', 239.00, 'SKU-WAHL-TAPER', false from public.categories where name = 'Maszynki do strzyżenia';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Moser 1400', 'Maszynka do strzyżenia, klasyczna, przewodowa', 129.00, 'SKU-MOSER-1400', false from public.categories where name = 'Maszynki do strzyżenia';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Panasonic ER-GP80', 'Maszynka do strzyżenia, bezprzewodowa, japońska technologia', 399.00, 'SKU-PANASONIC-GP80', false from public.categories where name = 'Maszynki do strzyżenia';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Fox Art', 'Maszynka do strzyżenia, bezprzewodowa, lekka', 179.00, 'SKU-FOX-ART', false from public.categories where name = 'Maszynki do strzyżenia';

insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'L''Oréal Pro Serie Expert', 'Szampon do włosów, ochrona koloru, 300ml', 39.99, 'SKU-LOREAL-SHAMPOO', false from public.categories where name = 'Szampony do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Wella Invigo Color Brilliance', 'Szampon do włosów, połysk i ochrona, 250ml', 34.99, 'SKU-WELLA-SHAMPOO', false from public.categories where name = 'Szampony do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Schwarzkopf BC Bonacure', 'Szampon do włosów, regeneracja, 250ml', 36.50, 'SKU-SCHWARZKOPF-SHAMPOO', false from public.categories where name = 'Szampony do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Matrix Total Results', 'Szampon do włosów, objętość i blask, 300ml', 32.00, 'SKU-MATRIX-SHAMPOO', false from public.categories where name = 'Szampony do włosów';

insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Kérastase Nutritive', 'Odżywka do włosów, głębokie odżywienie, 200ml', 69.99, 'SKU-KERASTASE-CONDITIONER', false from public.categories where name = 'Odżywki do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Wella Fusion', 'Odżywka do włosów, odbudowa, 200ml', 49.99, 'SKU-WELLA-CONDITIONER', false from public.categories where name = 'Odżywki do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'L''Oréal Absolut Repair', 'Odżywka do włosów, regeneracja, 200ml', 54.99, 'SKU-LOREAL-CONDITIONER', false from public.categories where name = 'Odżywki do włosów';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Schwarzkopf Gliss Kur', 'Odżywka do włosów, ochrona i blask, 200ml', 29.99, 'SKU-SCHWARZKOPF-CONDITIONER', false from public.categories where name = 'Odżywki do włosów';

insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Sibel Classic Brush', 'Pędzel do farby, klasyczny, miękkie włosie', 6.99, 'SKU-SIBEL-BRUSH', false from public.categories where name = 'Pędzle do farby';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Fox Color Brush', 'Pędzel do farby, ergonomiczny uchwyt', 7.50, 'SKU-FOX-BRUSH', false from public.categories where name = 'Pędzle do farby';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Comair Soft Touch', 'Pędzel do farby, miękki, precyzyjny', 8.99, 'SKU-COMAIR-BRUSH', false from public.categories where name = 'Pędzle do farby';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Olivia Garden Colorist', 'Pędzel do farby, profesjonalny, szeroki', 9.50, 'SKU-OLIVIA-BRUSH', false from public.categories where name = 'Pędzle do farby';

insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Fox Barber Cape', 'Peleryna fryzjerska, wodoodporna, czarna', 39.99, 'SKU-FOX-CAPE', false from public.categories where name = 'Peleryny fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Sibel Waterproof Cape', 'Peleryna fryzjerska, wodoodporna, szara', 44.99, 'SKU-SIBEL-CAPE', false from public.categories where name = 'Peleryny fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Comair Classic Cape', 'Peleryna fryzjerska, klasyczna, czarna', 29.99, 'SKU-COMAIR-CAPE', false from public.categories where name = 'Peleryny fryzjerskie';
insert into public.products (category_id, name, description, price, sku, is_archived)
select id, 'Jaguar Salon Cape', 'Peleryna fryzjerska, lekka, szybkoschnąca', 34.99, 'SKU-JAGUAR-CAPE', false from public.categories where name = 'Peleryny fryzjerskie';