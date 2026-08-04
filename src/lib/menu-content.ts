export type MenuItem = { amount?: string; name: string; allergens?: string; price: string };
export type MenuCategory = { title: string; items: MenuItem[] };

export const foodMenu: MenuCategory[] = [
  { title: "Něco k pivu", items: [
    { amount: "140 g", name: "Utopenec s cibulí a feferonkou, chléb", allergens: "1", price: "79 Kč" },
    { amount: "120 g", name: "Nakládaný hermelín s česnekem a feferonkou, chléb", allergens: "1, 7", price: "109 Kč" },
    { amount: "200 g", name: "Smažené bramborové lupínky s česnekovou majonézou", allergens: "7, 10", price: "139 Kč" },
    { amount: "200 g", name: "Zapečené hranolky se strouhaným sýrem Gouda a jalapeños", allergens: "3, 7", price: "139 Kč" },
    { amount: "1 ks", name: "Ďábelská topinka s masovou směsí, zeleninou a strouhaným sýrem Gouda", allergens: "1, 3, 7", price: "139 Kč" },
  ] },
  { title: "Polévky", items: [
    { amount: "0,33 l", name: "Hovězí vývar s játrovými knedlíčky, zeleninou a nudlemi", allergens: "1, 3, 7, 9", price: "69 Kč" },
    { amount: "0,33 l", name: "Polévka dle denní nabídky", price: "69 Kč" },
  ] },
  { title: "Tortilly a wrapy", items: [
    { amount: "300 g", name: "Tortilla s pancettou, nivou, cibulkou a rukolou", allergens: "1, 7", price: "179 Kč" },
    { amount: "300 g", name: "Tortilla quattro formaggi — eidam, niva, hermelín, parmazán", price: "179 Kč" },
    { amount: "400 g", name: "Wrap s trhaným vepřovým masem a ledovým salátem s mrkví", allergens: "1, 3, 7, 9", price: "199 Kč" },
    { amount: "400 g", name: "Wrap s grilovaným kuřecím masem a ledovým salátem s cherry rajčaty", allergens: "1, 7, 10", price: "199 Kč" },
  ] },
  { title: "Doporučujeme", items: [
    { amount: "700 g", name: "BBQ vepřová žebírka, salát Coleslaw, rozpečený bylinkový chléb", allergens: "1, 3, 7, 10", price: "289 Kč" },
    { amount: "750 g", name: "Pomalu pečené vepřové kolínko s kostí, salát Coleslaw, rozpečený bylinkový chléb", allergens: "1, 3, 7, 10", price: "289 Kč" },
    { amount: "150 g", name: "Hovězí tatarák z roštěné s topinkami", allergens: "1, 3", price: "289 Kč" },
    { amount: "200 g", name: "Burger s hovězím masem, čedarem, jalapeños, slaninovým chipsem, steakovými hranolky a Buffalo dipem", allergens: "1, 3, 7", price: "279 Kč" },
    { amount: "200 g", name: "Burger s hovězím masem, čedarem, sázeným vejcem, slaninovým chipsem, steakovými hranolky a Buffalo dipem", allergens: "1, 3, 7", price: "299 Kč" },
    { amount: "200 g", name: "Burger s hovězím masem a cibulkou Jack Daniel’s, čedarem, majonézou, steakovými hranolky a Buffalo dipem", allergens: "1, 3, 7", price: "299 Kč" },
    { amount: "200 g", name: "Burger s trhaným vepřovým masem, steakové hranolky a BBQ dip", allergens: "1, 3", price: "279 Kč" },
    { amount: "200 g", name: "Vepřové medailonky na cherry rajčatech, česneku a rukole", allergens: "1, 7, 9", price: "259 Kč" },
    { amount: "150 g", name: "Hovězí guláš s cibulí a feferonkou, bramboráčky", allergens: "1, 3", price: "229 Kč" },
    { amount: "200 g", name: "Kuřecí steak plněný sušenými rajčaty, smetanovo-bazalková omáčka", allergens: "7", price: "239 Kč" },
    { amount: "500 g", name: "Mísa smažených kuřecích řízečků, okurek, chléb", allergens: "1, 3, 7", price: "399 Kč" },
    { amount: "1 000 g", name: "Pečená kuřecí křídla, okurek, chléb", allergens: "1, 3, 7", price: "399 Kč" },
    { amount: "120 g", name: "Smažený sýr Gouda", allergens: "1, 3, 7", price: "149 Kč" },
    { amount: "180 g", name: "Smažený kuřecí řízek", allergens: "1, 3, 7", price: "179 Kč" },
  ] },
  { title: "Steaky na bylinkách", items: [
    { amount: "250 g", name: "Z vepřové panenky", price: "259 Kč" },
    { amount: "200 g", name: "Z kuřecích prsíček", price: "189 Kč" },
  ] },
  { title: "Omáčky", items: [
    { amount: "100 g", name: "Houbová", allergens: "1, 7, 9", price: "59 Kč" }, { amount: "100 g", name: "Pepřová", allergens: "1, 7, 9, 10", price: "59 Kč" },
    { amount: "100 g", name: "Barbecue", price: "49 Kč" }, { amount: "100 g", name: "Buffalo", allergens: "3, 7", price: "49 Kč" }, { amount: "100 g", name: "Sweet chilli", allergens: "7, 9", price: "49 Kč" },
    { amount: "100 g", name: "Domácí tatarská omáčka", allergens: "7, 10", price: "39 Kč" }, { amount: "100 g", name: "Česneková majonéza", allergens: "7, 10", price: "39 Kč" }, { amount: "100 g", name: "Kečup", price: "39 Kč" },
  ] },
  { title: "Saláty", items: [
    { amount: "300 g", name: "Caesar salát s kuřecím masem, ančovičkovým dresingem, krutony a parmazánem", allergens: "1, 3, 4, 7, 10", price: "239 Kč" },
    { amount: "300 g", name: "Salát s grilovaným hermelínem, slaninovým chipsem, listovými saláty a cherry rajčaty", allergens: "7", price: "239 Kč" },
  ] },
  { title: "Přílohy", items: [
    { amount: "200 g", name: "Hranolky", price: "49 Kč" }, { amount: "200 g", name: "Steakové hranolky", price: "59 Kč" }, { amount: "200 g", name: "Americké brambory s česnekem", price: "59 Kč" },
    { amount: "200 g", name: "Vařené brambory s máslem a petrželkou", allergens: "7", price: "49 Kč" }, { amount: "200 g", name: "Restované fazolky se slaninou a cibulkou", price: "69 Kč" }, { amount: "150 g", name: "Salát Coleslaw", allergens: "3, 7", price: "69 Kč" },
    { amount: "300 g", name: "Rozpečený bylinkový chléb", allergens: "1", price: "49 Kč" }, { amount: "1 ks", name: "Rozpečená bylinková bageta", allergens: "1, 3, 7", price: "49 Kč" }, { amount: "1 ks", name: "Krajíc chleba", allergens: "1, 3, 7", price: "9 Kč" },
  ] },
];

export const drinkMenu: MenuCategory[] = [
  { title: "Pivo", items: [
    { amount: "0,5 l", name: "Starobrno Medium", price: "48 Kč" }, { amount: "0,3 l", name: "Starobrno Medium", price: "31 Kč" }, { amount: "0,5 l", name: "Hauskrecht nefiltr 11", price: "51 Kč" }, { amount: "0,3 l", name: "Hauskrecht nefiltr 11", price: "32 Kč" }, { amount: "0,5 l", name: "Štatl 12", price: "54 Kč" }, { amount: "0,3 l", name: "Štatl 12", price: "33 Kč" }, { amount: "0,5 l", name: "Starobrno Bitr, láhev", price: "48 Kč" }, { amount: "0,4 l", name: "Cider, plech", price: "50 Kč" },
  ] },
  { title: "Nealkoholické nápoje", items: [
    { amount: "0,5 l", name: "Točená limonáda", price: "38 Kč" }, { amount: "0,3 l", name: "Točená limonáda", price: "22 Kč" }, { amount: "0,3 l", name: "Coca-Cola, Fanta, Tonic nebo Sprite, plech", price: "48 Kč" }, { amount: "0,3 l", name: "Mattoni — perlivá, jemně perlivá nebo neperlivá", price: "40 Kč" }, { amount: "0,25 l", name: "Juice Relax", price: "48 Kč" }, { amount: "0,5 l", name: "Krušovice hořké nealko, plech", price: "48 Kč" }, { amount: "0,5 l", name: "Radler nealko", price: "48 Kč" }, { amount: "1 ks", name: "Red Bull", price: "65 Kč" }, { amount: "1,0 l", name: "Kohoutková voda s citronem", price: "50 Kč" },
  ] },
  { title: "Víno", items: [
    { amount: "0,2 l", name: "Veltlínské zelené, Chateau Valtice", price: "60 Kč" }, { amount: "0,2 l", name: "Chardonnay, Chateau Valtice", price: "60 Kč" }, { amount: "0,2 l", name: "Svatovavřinecké, Chateau Valtice", price: "60 Kč" }, { amount: "0,7 l", name: "Bohemia sekt", price: "250 Kč" }, { amount: "0,2 l", name: "Prosecco", price: "70 Kč" }, { amount: "0,7 l", name: "Prosecco", price: "240 Kč" },
  ] },
  { title: "Alkoholické nápoje", items: [
    { amount: "0,04 l", name: "Božkov Tuzemský, kávový, zelená nebo vodka", price: "44 Kč" }, { amount: "0,04 l", name: "Republica Exclusive nebo Espresso", price: "55 Kč" }, { amount: "0,04 l", name: "Stará myslivecká", price: "48 Kč" }, { amount: "0,04 l", name: "Fernet Stock nebo Citrus", price: "48 Kč" }, { amount: "0,04 l", name: "Becherovka", price: "48 Kč" }, { amount: "0,04 l", name: "Spišská borovička", price: "48 Kč" }, { amount: "0,04 l", name: "Havana Club", price: "55 Kč" }, { amount: "0,04 l", name: "Finlandia", price: "55 Kč" }, { amount: "0,04 l", name: "Malibu", price: "60 Kč" }, { amount: "0,04 l", name: "Baileys", price: "60 Kč" }, { amount: "0,04 l", name: "Captain Morgan", price: "55 Kč" }, { amount: "0,04 l", name: "Tullamore Dew", price: "60 Kč" }, { amount: "0,04 l", name: "Jameson", price: "60 Kč" }, { amount: "0,04 l", name: "Tequila Sierra", price: "60 Kč" }, { amount: "0,04 l", name: "Jägermeister", price: "60 Kč" }, { amount: "0,04 l", name: "Beefeater Gin", price: "60 Kč" }, { amount: "0,04 l", name: "Jack Daniel’s Tennessee Honey, Fire nebo Apple", price: "70 Kč" },
  ] },
  { title: "Teplé nápoje", items: [
    { amount: "1 ks", name: "Čaj Ahmad s medem", price: "59 Kč" }, { amount: "7 g", name: "Espresso", allergens: "7", price: "50 Kč" }, { amount: "7 g", name: "Turecká káva", price: "45 Kč" }, { amount: "7 g", name: "Cappuccino", allergens: "7", price: "60 Kč" }, { amount: "7 g", name: "Latte macchiato", allergens: "7", price: "65 Kč" }, { amount: "7 g", name: "Vídeňská káva", allergens: "7", price: "65 Kč" }, { amount: "4 cl", name: "Grog rumový", price: "60 Kč" }, { amount: "0,2 l", name: "Svařené červené víno", price: "70 Kč" },
  ] },
  { title: "Dobroty", items: [
    { amount: "1 ks", name: "Tyčinky", price: "35 Kč" }, { amount: "1 ks", name: "Tyčinky dlouhé", price: "35 Kč" }, { amount: "1 ks", name: "Brambůrky", price: "40 Kč" }, { amount: "1 ks", name: "Arašídy solené", price: "35 Kč" }, { amount: "1 ks", name: "Mandle solené nebo uzené", price: "60 Kč" },
  ] },
  { title: "Bartida pálenky", items: [
    { amount: "0,04 l", name: "Meruňkovice 43 %", price: "70 Kč" }, { amount: "0,04 l", name: "Calvados 40 %", price: "70 Kč" }, { amount: "0,04 l", name: "Hruškovice 43 %", price: "70 Kč" }, { amount: "0,04 l", name: "Slivovice 47 %", price: "70 Kč" },
  ] },
];
