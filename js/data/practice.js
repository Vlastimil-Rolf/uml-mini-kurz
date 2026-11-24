/**
 * Datový modul praktické části: 3 praktické kapitoly (každá se 4 navazujícími podkapitolami).
 * - Kapitola 1 (Autoservis): kompletní implementace všech 4 kroků (p-auto-01 až p-auto-04).
 * - Kapitola 2 (Banka): kompletní implementace všech 4 kroků (p-banka-01 až p-banka-04).
 * - Kapitola 3 (Geometrie (Malování)): kompletní implementace všech 4 kroků (p-geo-01 až p-geo-04).
 *
 * Klíčové pravidlo pro inheritPreviousCanvas: true:
 * Všechny třídy v rámci jedné kapitoly si zachovávají stabilní `id` napříč všemi 4 kroky,
 * takže editor zachová pozice (x, y) a existující vazby z předchozího kroku a automaticky
 * promítne nové metody, změny viditelnosti (#) či abstraktnost třídy.
 */

function normalizePracticeSubchapter(chapterId, rawSub) {
  const normalizedClasses = rawSub.classes.map((cls) => ({
    ...cls,
    stereotype: cls.stereotype ?? (cls.kind === 'interface' ? 'interface' : (cls.isAbstract ? 'abstract' : null)),
    isAbstract: Boolean(cls.isAbstract || cls.kind === 'interface')
  }));

  return {
    // Primární datové schéma
    id: rawSub.id,
    title: rawSub.title,
    storyIntro: rawSub.storyIntro,
    assignmentHtml: rawSub.assignmentHtml,
    inheritPreviousCanvas: rawSub.inheritPreviousCanvas,
    classes: normalizedClasses,
    validationRules: rawSub.validationRules,

    // Metadata a aliasy pro přímou kompatibilitu se stávajícími moduly aplikace
    chapterId,
    type: 'practice',
    order: rawSub.order,
    shortTitle: rawSub.shortTitle,
    maxXp: 100,
    previousSubchapterId: rawSub.previousSubchapterId,
    theoryContent: null,
    masterIntro: rawSub.storyIntro,
    assignment: {
      title: rawSub.assignmentTitle || rawSub.title,
      descriptionHtml: rawSub.assignmentHtml,
      requirements: rawSub.requirements || [],
      hints: rawSub.hints || []
    },
    paletteClasses: normalizedClasses,
    expectedClasses: rawSub.validationRules.expectedClasses,
    expectedRelations: rawSub.validationRules.expectedRelations
  };
}

// ============================================================================
// SDÍLENÉ DEFINICE TŘÍD PRO KAPITOLU 1: AUTOSERVIS
// ============================================================================

const AUTO_CLASS_ZAKAZNIK = {
  id: 'auto-zakaznik',
  kind: 'class',
  name: 'Zakaznik',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'zakaznikId', type: 'String', isStatic: false },
    { visibility: '-', name: 'jmeno', type: 'String', isStatic: false },
    { visibility: '-', name: 'prijmeni', type: 'String', isStatic: false },
    { visibility: '-', name: 'telefon', type: 'String', isStatic: false },
    { visibility: '-', name: 'email', type: 'String', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'pridejVozidlo', params: 'vozidlo: Vozidlo', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'odeberVozidlo', params: 'vin: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'aktualizujTelefon', params: 'novyTelefon: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejPocetVozidel', params: '', returnType: 'int', isAbstract: false, isStatic: false }
  ]
};

const AUTO_CLASS_VOZIDLO_CONCRETE = {
  id: 'auto-vozidlo',
  kind: 'class',
  name: 'Vozidlo',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'vin', type: 'String', isStatic: false },
    { visibility: '-', name: 'spz', type: 'String', isStatic: false },
    { visibility: '-', name: 'znacka', type: 'String', isStatic: false },
    { visibility: '-', name: 'rokVyroby', type: 'int', isStatic: false },
    { visibility: '-', name: 'najeteKm', type: 'int', isStatic: false },
    { visibility: '-', name: 'technickyZpusobile', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vypoctiZakladniSazbu', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejTypVozidla', params: '', returnType: 'String', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'aktualizujNajezd', params: 'noveKm: int', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'nastavTechnickouZpusobilost', params: 'zpusobile: boolean', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejVin', params: '', returnType: 'String', isAbstract: false, isStatic: false },
    { visibility: '-', name: 'overNajezd', params: 'noveKm: int', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

const AUTO_CLASS_VOZIDLO_ABSTRACT = {
  id: 'auto-vozidlo',
  kind: 'class',
  name: 'Vozidlo',
  isAbstract: true,
  attributes: [
    { visibility: '-', name: 'vin', type: 'String', isStatic: false },
    { visibility: '-', name: 'spz', type: 'String', isStatic: false },
    { visibility: '-', name: 'znacka', type: 'String', isStatic: false },
    { visibility: '-', name: 'rokVyroby', type: 'int', isStatic: false },
    { visibility: '#', name: 'najeteKm', type: 'int', isStatic: false },
    { visibility: '#', name: 'technickyZpusobile', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vypoctiZakladniSazbu', params: '', returnType: 'BigDecimal', isAbstract: true, isStatic: false },
    { visibility: '+', name: 'ziskejTypVozidla', params: '', returnType: 'String', isAbstract: true, isStatic: false },
    { visibility: '+', name: 'aktualizujNajezd', params: 'noveKm: int', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'nastavTechnickouZpusobilost', params: 'zpusobile: boolean', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejVin', params: '', returnType: 'String', isAbstract: false, isStatic: false },
    { visibility: '#', name: 'overNajezd', params: 'noveKm: int', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

const AUTO_CLASS_MECHANIK = {
  id: 'auto-mechanik',
  kind: 'class',
  name: 'Mechanik',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'mechanikId', type: 'String', isStatic: false },
    { visibility: '-', name: 'jmeno', type: 'String', isStatic: false },
    { visibility: '-', name: 'prijmeni', type: 'String', isStatic: false },
    { visibility: '-', name: 'specializace', type: 'String', isStatic: false },
    { visibility: '-', name: 'dostupny', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'nastavDostupnost', params: 'dostupny: boolean', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zmenSpecializaci', params: 'novaSpecializace: String', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'jeDostupny', params: '', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

const AUTO_CLASS_ZAKAZKA_BASE = {
  id: 'auto-zakazka',
  kind: 'class',
  name: 'ServisniZakazka',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'cisloZakazky', type: 'String', isStatic: false },
    { visibility: '-', name: 'datumPrijeti', type: 'LocalDateTime', isStatic: false },
    { visibility: '-', name: 'planovaneDokonceni', type: 'LocalDate', isStatic: false },
    { visibility: '-', name: 'stav', type: 'String', isStatic: false },
    { visibility: '-', name: 'poznamka', type: 'String', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'priradMechanika', params: 'mechanik: Mechanik', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vypoctiCelkovouCenu', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'uzavriZakazku', params: '', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '-', name: 'vypoctiDph', params: 'zakladDane: BigDecimal', returnType: 'BigDecimal', isAbstract: false, isStatic: false }
  ]
};

const AUTO_CLASS_ZAKAZKA_FULL = {
  id: 'auto-zakazka',
  kind: 'class',
  name: 'ServisniZakazka',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'cisloZakazky', type: 'String', isStatic: false },
    { visibility: '-', name: 'datumPrijeti', type: 'LocalDateTime', isStatic: false },
    { visibility: '-', name: 'planovaneDokonceni', type: 'LocalDate', isStatic: false },
    { visibility: '-', name: 'stav', type: 'String', isStatic: false },
    { visibility: '-', name: 'poznamka', type: 'String', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'priradMechanika', params: 'mechanik: Mechanik', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'pridejPolozku', params: 'polozka: PolozkaZakazky', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'odeberPolozku', params: 'polozkaId: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vypoctiCelkovouCenu', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'uzavriZakazku', params: '', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '-', name: 'vypoctiDph', params: 'zakladDane: BigDecimal', returnType: 'BigDecimal', isAbstract: false, isStatic: false }
  ]
};

const AUTO_CLASS_AUTOSERVIS = {
  id: 'auto-autoservis',
  kind: 'class',
  name: 'Autoservis',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'nazev', type: 'String', isStatic: false },
    { visibility: '-', name: 'ico', type: 'String', isStatic: false },
    { visibility: '-', name: 'adresa', type: 'String', isStatic: false },
    { visibility: '-', name: 'hodinovaSazba', type: 'BigDecimal', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'pridejMechanika', params: 'mechanik: Mechanik', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'odeberMechanika', params: 'mechanikId: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zalozZakazku', params: 'zakazka: ServisniZakazka', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'najdiZakazku', params: 'cisloZakazky: String', returnType: 'ServisniZakazka', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejPocetOtevrenychZakazek', params: '', returnType: 'int', isAbstract: false, isStatic: false }
  ]
};

const AUTO_CLASS_POLOZKA = {
  id: 'auto-polozka',
  kind: 'class',
  name: 'PolozkaZakazky',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'polozkaId', type: 'String', isStatic: false },
    { visibility: '-', name: 'popis', type: 'String', isStatic: false },
    { visibility: '-', name: 'mnozstvi', type: 'double', isStatic: false },
    { visibility: '-', name: 'jednotkovaCena', type: 'BigDecimal', isStatic: false },
    { visibility: '-', name: 'jeNahradniDil', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vypoctiMezisoucet', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'upravMnozstvi', params: 'noveMnozstvi: double', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zmenJednotkovouCenu', params: 'novaCena: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

const AUTO_CLASS_OSOBNI_AUTO = {
  id: 'auto-osobni-auto',
  kind: 'class',
  name: 'OsobniAuto',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'pocetMist', type: 'int', isStatic: false },
    { visibility: '-', name: 'typKaroserie', type: 'String', isStatic: false },
    { visibility: '-', name: 'maTazneZarizeni', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vypoctiZakladniSazbu', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejTypVozidla', params: '', returnType: 'String', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'nastavTazneZarizeni', params: 'pritomno: boolean', returnType: 'void', isAbstract: false, isStatic: false }
  ]
};

const AUTO_CLASS_DODAVKA = {
  id: 'auto-dodavka',
  kind: 'class',
  name: 'Dodavka',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'nosnostKg', type: 'double', isStatic: false },
    { visibility: '-', name: 'objemNakladuM3', type: 'double', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vypoctiZakladniSazbu', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejTypVozidla', params: '', returnType: 'String', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'jeNadLimitNosnosti', params: 'aktualniZatizeniKg: double', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '-', name: 'overZatizeni', params: 'zatizeniKg: double', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

// ============================================================================
// PRAKTICKÁ KAPITOLA 1: AUTOSERVIS (4 NAVAZUJÍCÍ KROKY)
// ============================================================================

const RAW_AUTOSERVIS_SUBCHAPTERS = [
  // --------------------------------------------------------------------------
  // Krok 1 (2.1): Základní třídy, zapouzdření a prostá asociace s násobnostmi
  // --------------------------------------------------------------------------
  {
    id: 'p-auto-01',
    order: 1,
    title: '2.1 Základní třídy, zapouzdření a prostá asociace s násobnostmi',
    shortTitle: '2.1 Zákazník a Vozidlo',
    storyIntro: 'Vítej v dílně Autoservisu! Začneme pevným základem celého systému: propojíme zákazníka s jeho vozidly pomocí prosté obousměrné asociace.',
    inheritPreviousCanvas: false,
    previousSubchapterId: null,
    assignmentTitle: 'Autoservis 1/4: Základní třídy, zapouzdření a prostá asociace s násobnostmi',
    assignmentHtml: `
      <p>Vytvořte výchozí návrhový diagram tříd (UML 2.5) pro doménu <strong>Autoservis</strong> určený pro implementaci v jazyce Java. Diagram v tomto prvním kroku obsahuje <strong>přesně dvě konkrétní třídy propojené jednou jednoduchou obousměrnou asociací</strong>. Odkazy mezi objekty vyjadřujte výhradně asociačními vazbami (neduplikujte je jako atributy uvnitř tříd) a nemodelujte konstruktory ani žádné nespecifikované atributy či metody.</p>
      <p>Vytvořte konkrétní třídu <strong>Zakaznik</strong> se všemi atributy soukromými (<code>-</code>): <code>zakaznikId</code> typu <code>String</code>, <code>jmeno</code> typu <code>String</code>, <code>prijmeni</code> typu <code>String</code>, <code>telefon</code> typu <code>String</code> a <code>email</code> typu <code>String</code>. Třída poskytuje čtyři veřejné operace (<code>+</code>): <code>pridejVozidlo</code> s parametrem <code>vozidlo</code> typu <code>Vozidlo</code> vracející <code>void</code>, <code>odeberVozidlo</code> s parametrem <code>vin</code> typu <code>String</code> vracející <code>boolean</code>, <code>aktualizujTelefon</code> s parametrem <code>novyTelefon</code> typu <code>String</code> vracející <code>boolean</code> a bezparametrickou operaci <code>ziskejPocetVozidel</code> vracející <code>int</code>.</p>
      <p>Vytvořte konkrétní třídu <strong>Vozidlo</strong> (v tomto kroku zatím jako běžnou konkrétní třídu, nikoli abstraktní) se všemi atributy soukromými (<code>-</code>): <code>vin</code> typu <code>String</code>, <code>spz</code> typu <code>String</code>, <code>znacka</code> typu <code>String</code>, <code>rokVyroby</code> typu <code>int</code>, <code>najeteKm</code> typu <code>int</code> a <code>technickyZpusobile</code> typu <code>boolean</code>. Třída poskytuje pět veřejných operací (<code>+</code>): bezparametrické operace <code>vypoctiZakladniSazbu</code> vracející <code>BigDecimal</code>, <code>ziskejTypVozidla</code> vracející <code>String</code> a <code>ziskejVin</code> vracející <code>String</code>, dále operaci <code>aktualizujNajezd</code> s parametrem <code>noveKm</code> typu <code>int</code> vracející <code>boolean</code> a operaci <code>nastavTechnickouZpusobilost</code> s parametrem <code>zpusobile</code> typu <code>boolean</code> vracející <code>void</code>. Dále obsahuje jednu soukromou pomocnou operaci (<code>-</code>) <code>overNajezd</code> s parametrem <code>noveKm</code> typu <code>int</code> vracející <code>boolean</code>.</p>
      <p>Třídy <strong>Zakaznik</strong> a <strong>Vozidlo</strong> propojte <strong>prostou obousměrnou asociací</strong> (plná čára bez šipek a bez kosočtverců) s popiskem <code>vlastní</code>. Každé vozidlo patří vždy právě jednomu zákazníkovi (násobnost <code>1</code> na straně <code>Zakaznik</code>) a každý zákazník musí vlastnit alespoň jedno vozidlo (násobnost <code>1..*</code> na straně <code>Vozidlo</code>). Názvy rolí na koncích vazby v tomto kroku neuvádějte.</p>
    `,
    requirements: [
      'Umístěte na plátno konkrétní třídy <strong>Zakaznik</strong> a <strong>Vozidlo</strong>.',
      'Propojte je <strong>prostou obousměrnou asociací</strong> (plná čára bez šipek) s popiskem <code>vlastní</code>.',
      'Nastavte násobnosti: <code>1</code> na straně <code>Zakaznik</code> a <code>1..*</code> na straně <code>Vozidlo</code> (bez rolí).'
    ],
    hints: [
      'Nechte si kolem obou tříd na plátně dostatek volného místa – v dalších třech krocích na tento diagram přímo navážeme a doplníme dalších šest tříd.'
    ],
    classes: [AUTO_CLASS_ZAKAZNIK, AUTO_CLASS_VOZIDLO_CONCRETE],
    validationRules: {
      counts: { classifiers: 2, relations: 1 },
      expectedClasses: ['auto-zakaznik', 'auto-vozidlo'],
      expectedRelations: [
        {
          id: 'auto-rel-zakaznik-vozidlo',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'auto-zakaznik',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'auto-vozidlo',
          targetMultiplicity: '1..*',
          targetRole: null,
          label: 'vlastní',
          feedback: {
            wrongType: 'Mezi třídami Zakaznik a Vozidlo použij prostou obousměrnou asociaci (plná čára bez šipek a bez kosočtverců).',
            wrongSourceMultiplicity: 'U vazby Zakaznik – Vozidlo nastav na straně Zakaznik násobnost "1" (každé vozidlo patří právě jednomu zákazníkovi).',
            wrongTargetMultiplicity: 'U vazby Zakaznik – Vozidlo nastav na straně Vozidlo násobnost "1..*" (každý zákazník vlastní alespoň jedno vozidlo).'
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 2 (2.2): Navigovatelnost asociací a role
  // --------------------------------------------------------------------------
  {
    id: 'p-auto-02',
    order: 2,
    title: '2.2 Navigovatelnost asociací a role',
    shortTitle: '2.2 Zakázka a Mechanik',
    storyIntro: 'Výborně, základ stojí. Teď na tvé plátno přivedeme servisní zakázky a mechaniky – doplň role ke stávající vazbě a veď jednosměrné asociace od zakázky.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-auto-01',
    assignmentTitle: 'Autoservis 2/4: Navigovatelnost asociací a role',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.1</strong> a rozšiřte jej o servisní zakázky, mechaniky, jednosměrnou navigovatelnost asociací a názvy rolí. Všechny stávající třídy, atributy a metody z předchozího kroku zachovejte beze změny a proveďte přesně následující úpravy a doplnění:</p>
      <ul>
        <li><strong>Úprava stávající vazby Zakaznik – Vozidlo (<code>vlastní</code>):</strong> Ponechte vazbu jako prostou obousměrnou asociaci se stejnými násobnostmi (<code>1</code> a <code>1..*</code>), ale doplňte názvy rolí na oba konce – na stranu <code>Zakaznik</code> přidejte roli <code>vlastnik</code> a na stranu <code>Vozidlo</code> přidejte roli <code>vozidla</code>.</li>
        <li><strong>Nová konkrétní třída Mechanik:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>mechanikId</code> typu <code>String</code>, <code>jmeno</code> typu <code>String</code>, <code>prijmeni</code> typu <code>String</code>, <code>specializace</code> typu <code>String</code> a <code>dostupny</code> typu <code>boolean</code>. Přidejte tři veřejné operace (<code>+</code>): <code>nastavDostupnost</code> s parametrem <code>dostupny</code> typu <code>boolean</code> vracející <code>void</code>, <code>zmenSpecializaci</code> s parametrem <code>novaSpecializace</code> typu <code>String</code> vracející <code>void</code> a bezparametrickou operaci <code>jeDostupny</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová konkrétní třída ServisniZakazka</strong> (základní rozsah před zavedením položek zakázky): Přidejte třídu se soukromými atributy (<code>-</code>): <code>cisloZakazky</code> typu <code>String</code>, <code>datumPrijeti</code> typu <code>LocalDateTime</code>, <code>planovaneDokonceni</code> typu <code>LocalDate</code>, <code>stav</code> typu <code>String</code> a <code>poznamka</code> typu <code>String</code>. Přidejte tři veřejné operace (<code>+</code>): <code>priradMechanika</code> s parametrem <code>mechanik</code> typu <code>Mechanik</code> vracející <code>void</code>, bezparametrickou operaci <code>vypoctiCelkovouCenu</code> vracející <code>BigDecimal</code> a bezparametrickou operaci <code>uzavriZakazku</code> vracející <code>boolean</code>. Dále přidejte jednu soukromou pomocnou operaci (<code>-</code>) <code>vypoctiDph</code> s parametrem <code>zakladDane</code> typu <code>BigDecimal</code> vracející <code>BigDecimal</code>.</li>
        <li><strong>Nová vazba ServisniZakazka → Mechanik:</strong> Vytvořte prostou jednosměrnou asociaci směřující ze <code>ServisniZakazka</code> na <code>Mechanik</code> (šipka u <code>Mechanik</code>) s popiskem <code>přidělena</code>. Na straně <code>ServisniZakazka</code> uveďte násobnost <code>0..*</code> (bez role), na straně <code>Mechanik</code> uveďte násobnost <code>0..1</code> a roli <code>pridelenyMechanik</code>.</li>
        <li><strong>Nová vazba ServisniZakazka → Vozidlo:</strong> Vytvořte prostou jednosměrnou asociaci směřující ze <code>ServisniZakazka</code> na <code>Vozidlo</code> (šipka u <code>Vozidlo</code>) s popiskem <code>opravuje</code>. Na straně <code>ServisniZakazka</code> uveďte násobnost <code>0..*</code> (bez role), na straně <code>Vozidlo</code> uveďte násobnost <code>1</code> a roli <code>opravovaneVozidlo</code>.</li>
      </ul>
    `,
    requirements: [
      'Klikněte na stávající vazbu <code>Zakaznik – Vozidlo</code> a doplňte role: <code>vlastnik</code> u <code>Zakaznik</code> a <code>vozidla</code> u <code>Vozidlo</code>.',
      'Přidejte na plátno nové třídy <strong>Mechanik</strong> a <strong>ServisniZakazka</strong>.',
      'Vytvořte jednosměrnou asociaci <code>ServisniZakazka (0..*)</code> → <code>Mechanik (0..1, role: pridelenyMechanik)</code> s popiskem <code>přidělena</code>.',
      'Vytvořte jednosměrnou asociaci <code>ServisniZakazka (0..*)</code> → <code>Vozidlo (1, role: opravovaneVozidlo)</code> s popiskem <code>opravuje</code>.'
    ],
    hints: [
      'Existující vazbu Zakaznik – Vozidlo nemusíte mazat – stačí na ni kliknout a doplnit názvy rolí vlastnik a vozidla.'
    ],
    classes: [AUTO_CLASS_MECHANIK, AUTO_CLASS_ZAKAZNIK, AUTO_CLASS_VOZIDLO_CONCRETE, AUTO_CLASS_ZAKAZKA_BASE],
    validationRules: {
      counts: { classifiers: 4, relations: 3 },
      expectedClasses: ['auto-mechanik', 'auto-zakaznik', 'auto-vozidlo', 'auto-zakazka'],
      expectedRelations: [
        {
          id: 'auto-rel-zakazka-mechanik',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'auto-zakazka',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'auto-mechanik',
          targetMultiplicity: '0..1',
          targetRole: 'pridelenyMechanik',
          label: 'přidělena',
          feedback: {
            wrongTargetMultiplicity: 'U vazby ServisniZakazka → Mechanik nastav na straně Mechanik násobnost "0..1" (zakázka nemusí mít mechanika přiděleného ihned).',
            wrongTargetRole: 'U vazby ServisniZakazka → Mechanik doplň na straně Mechanik roli "pridelenyMechanik".'
          }
        },
        {
          id: 'auto-rel-zakazka-vozidlo',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'auto-zakazka',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'auto-vozidlo',
          targetMultiplicity: '1',
          targetRole: 'opravovaneVozidlo',
          label: 'opravuje',
          feedback: {
            wrongTargetMultiplicity: 'U vazby ServisniZakazka → Vozidlo nastav na straně Vozidlo násobnost "1" (každá zakázka opravuje právě jedno vozidlo).',
            wrongTargetRole: 'U vazby ServisniZakazka → Vozidlo doplň na straně Vozidlo roli "opravovaneVozidlo".'
          }
        },
        {
          id: 'auto-rel-zakaznik-vozidlo',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'auto-zakaznik',
          sourceMultiplicity: '1',
          sourceRole: 'vlastnik',
          targetId: 'auto-vozidlo',
          targetMultiplicity: '1..*',
          targetRole: 'vozidla',
          label: 'vlastní',
          feedback: {
            wrongSourceRole: 'Na stávající obousměrné vazbě Zakaznik – Vozidlo nezapomeň doplnit roli "vlastnik" na straně třídy Zakaznik.',
            wrongTargetRole: 'Na stávající obousměrné vazbě Zakaznik – Vozidlo nezapomeň doplnit roli "vozidla" na straně třídy Vozidlo.'
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 3 (2.3): Vazby celek–část (agregace a kompozice)
  // --------------------------------------------------------------------------
  {
    id: 'p-auto-03',
    order: 3,
    title: '2.3 Vazby celek–část (agregace a kompozice)',
    shortTitle: '2.3 Autoservis a Položky',
    storyIntro: 'Třída ServisniZakazka byla automaticky rozšířena o metody pro správu položek. Nyní doplň zastřešující provozovnu Autoservis, třídu PolozkaZakazky a správně rozliš agregaci od kompozice.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-auto-02',
    assignmentTitle: 'Autoservis 3/4: Vazby celek–část (agregace a kompozice)',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.2</strong> a doplňte ústřední provozovnu autoservisu, fakturované položky zakázek a vazby typu celek–část (agregace a kompozice). Všechny dosavadní prvky z předchozího kroku zachovejte a proveďte přesně následující změny:</p>
      <ul>
        <li><strong>Úprava stávající třídy ServisniZakazka:</strong> Doplňte dvě veřejné operace (<code>+</code>) pro správu položek: <code>pridejPolozku</code> s parametrem <code>polozka</code> typu <code>PolozkaZakazky</code> vracející <code>void</code> a <code>odeberPolozku</code> s parametrem <code>polozkaId</code> typu <code>String</code> vracející <code>boolean</code> <em>(aktualizace se automaticky promítla na kartě třídy na plátně)</em>.</li>
        <li><strong>Nová konkrétní třída Autoservis:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>nazev</code> typu <code>String</code>, <code>ico</code> typu <code>String</code>, <code>adresa</code> typu <code>String</code> a <code>hodinovaSazba</code> typu <code>BigDecimal</code>. Přidejte pět veřejných operací (<code>+</code>): <code>pridejMechanika</code> s parametrem <code>mechanik</code> typu <code>Mechanik</code> vracející <code>void</code>, <code>odeberMechanika</code> s parametrem <code>mechanikId</code> typu <code>String</code> vracející <code>boolean</code>, <code>zalozZakazku</code> s parametrem <code>zakazka</code> typu <code>ServisniZakazka</code> vracející <code>void</code>, <code>najdiZakazku</code> s parametrem <code>cisloZakazky</code> typu <code>String</code> vracející <code>ServisniZakazka</code> a bezparametrickou operaci <code>ziskejPocetOtevrenychZakazek</code> vracející <code>int</code>.</li>
        <li><strong>Nová konkrétní třída PolozkaZakazky:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>polozkaId</code> typu <code>String</code>, <code>popis</code> typu <code>String</code>, <code>mnozstvi</code> typu <code>double</code>, <code>jednotkovaCena</code> typu <code>BigDecimal</code> a <code>jeNahradniDil</code> typu <code>boolean</code>. Přidejte tři veřejné operace (<code>+</code>): bezparametrickou operaci <code>vypoctiMezisoucet</code> vracející <code>BigDecimal</code>, operaci <code>upravMnozstvi</code> s parametrem <code>noveMnozstvi</code> typu <code>double</code> vracející <code>boolean</code> a operaci <code>zmenJednotkovouCenu</code> s parametrem <code>novaCena</code> typu <code>BigDecimal</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová agregace Autoservis ◇→ Mechanik:</strong> Autoservis sdružuje mechaniky s nezávislým životním cyklem (při zrušení autoservisu záznamy mechaniků v systému nadále existují). Vytvořte <strong>jednosměrnou agregaci</strong> z celku <code>Autoservis</code> (prázdný kosočtverec u <code>Autoservis</code>) k části <code>Mechanik</code> (šipka u <code>Mechanik</code>) s popiskem <code>zaměstnává</code>. Na straně <code>Autoservis</code> uveďte násobnost <code>0..1</code> (bez role), na straně <code>Mechanik</code> uveďte násobnost <code>0..*</code> a roli <code>mechanici</code>.</li>
        <li><strong>Nová kompozice Autoservis ◆→ ServisniZakazka:</strong> Servisní zakázky jsou existenčně závislou součástí autoservisu a při jeho zrušení zanikají. Vytvořte <strong>jednosměrnou kompozici</strong> z celku <code>Autoservis</code> (plný kosočtverec u <code>Autoservis</code>) k části <code>ServisniZakazka</code> (šipka u <code>ServisniZakazka</code>) s popiskem <code>eviduje</code>. Na straně <code>Autoservis</code> uveďte násobnost <code>1</code> (bez role), na straně <code>ServisniZakazka</code> uveďte násobnost <code>0..*</code> a roli <code>zakazky</code>.</li>
        <li><strong>Nová kompozice ServisniZakazka ◆→ PolozkaZakazky:</strong> Položky zakázky jsou existenčně vázány na konkrétní zakázku a při jejím odstranění zanikají. Vytvořte <strong>jednosměrnou kompozici</strong> z celku <code>ServisniZakazka</code> (plný kosočtverec u <code>ServisniZakazka</code>) k části <code>PolozkaZakazky</code> (šipka u <code>PolozkaZakazky</code>) s popiskem <code>obsahuje</code>. Na straně <code>ServisniZakazka</code> uveďte násobnost <code>1</code> (bez role), na straně <code>PolozkaZakazky</code> uveďte násobnost <code>1..*</code> a roli <code>polozky</code>.</li>
      </ul>
    `,
    requirements: [
      'Zachovejte všechny 4 stávající třídy a 3 vazby z předchozího kroku.',
      'Přidejte z palety nové třídy <strong>Autoservis</strong> a <strong>PolozkaZakazky</strong>.',
      'Vytvořte jednosměrnou <strong>agregaci</strong> <code>Autoservis (0..1)</code> ◇→ <code>Mechanik (0..*, role: mechanici)</code> s popiskem <code>zaměstnává</code>.',
      'Vytvořte jednosměrnou <strong>kompozici</strong> <code>Autoservis (1)</code> ◆→ <code>ServisniZakazka (0..*, role: zakazky)</code> s popiskem <code>eviduje</code>.',
      'Vytvořte jednosměrnou <strong>kompozici</strong> <code>ServisniZakazka (1)</code> ◆→ <code>PolozkaZakazky (1..*, role: polozky)</code> s popiskem <code>obsahuje</code>.'
    ],
    hints: [
      'Autoservis → Mechanik je slabá agregace (prázdný kosočtverec, 0..1), zatímco Autoservis → ServisniZakazka i ServisniZakazka → PolozkaZakazky jsou silné kompozice (plný kosočtverec, 1).'
    ],
    classes: [
      AUTO_CLASS_AUTOSERVIS,
      AUTO_CLASS_MECHANIK,
      AUTO_CLASS_ZAKAZNIK,
      AUTO_CLASS_VOZIDLO_CONCRETE,
      AUTO_CLASS_ZAKAZKA_FULL,
      AUTO_CLASS_POLOZKA
    ],
    validationRules: {
      counts: { classifiers: 6, relations: 6 },
      expectedClasses: ['auto-autoservis', 'auto-mechanik', 'auto-zakaznik', 'auto-vozidlo', 'auto-zakazka', 'auto-polozka'],
      expectedRelations: [
        {
          id: 'auto-rel-autoservis-mechanik',
          type: 'aggregation',
          navigability: 'unidirectional',
          sourceId: 'auto-autoservis',
          sourceMultiplicity: '0..1',
          sourceRole: null,
          targetId: 'auto-mechanik',
          targetMultiplicity: '0..*',
          targetRole: 'mechanici',
          label: 'zaměstnává',
          feedback: {
            wrongType: 'Mechanici mají nezávislý životní cyklus (při zrušení autoservisu nezanikají) – mezi Autoservis a Mechanik použij jednosměrnou agregaci (prázdný kosočtverec).',
            wrongSourceMultiplicity: 'U agregace Autoservis ◇→ Mechanik uveď na straně Autoservis násobnost "0..1".',
            wrongTargetRole: 'U agregace Autoservis ◇→ Mechanik uveď na straně Mechanik roli "mechanici".'
          }
        },
        {
          id: 'auto-rel-autoservis-zakazka',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'auto-autoservis',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'auto-zakazka',
          targetMultiplicity: '0..*',
          targetRole: 'zakazky',
          label: 'eviduje',
          feedback: {
            wrongType: 'Servisní zakázky jsou existenčně závislé na autoservisu – mezi Autoservis a ServisniZakazka použij jednosměrnou kompozici (plný kosočtverec).',
            wrongSourceMultiplicity: 'U kompozice Autoservis ◆→ ServisniZakazka musí být na straně celku (Autoservis) násobnost "1".',
            wrongTargetRole: 'U kompozice Autoservis ◆→ ServisniZakazka uveď na straně ServisniZakazka roli "zakazky".'
          }
        },
        {
          id: 'auto-rel-zakazka-polozka',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'auto-zakazka',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'auto-polozka',
          targetMultiplicity: '1..*',
          targetRole: 'polozky',
          label: 'obsahuje',
          feedback: {
            wrongType: 'Položky zakázky zanikají spolu se zakázkou – mezi ServisniZakazka a PolozkaZakazky použij jednosměrnou kompozici (plný kosočtverec).',
            wrongSourceMultiplicity: 'U kompozice ServisniZakazka ◆→ PolozkaZakazky musí být na straně celku (ServisniZakazka) násobnost "1".',
            wrongTargetMultiplicity: 'Každá servisní zakázka musí obsahovat alespoň jednu položku – na straně PolozkaZakazky uveď násobnost "1..*".',
            wrongTargetRole: 'U kompozice ServisniZakazka ◆→ PolozkaZakazky uveď na straně PolozkaZakazky roli "polozky".'
          }
        },
        {
          id: 'auto-rel-zakazka-mechanik',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'auto-zakazka',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'auto-mechanik',
          targetMultiplicity: '0..1',
          targetRole: 'pridelenyMechanik',
          label: 'přidělena'
        },
        {
          id: 'auto-rel-zakazka-vozidlo',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'auto-zakazka',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'auto-vozidlo',
          targetMultiplicity: '1',
          targetRole: 'opravovaneVozidlo',
          label: 'opravuje'
        },
        {
          id: 'auto-rel-zakaznik-vozidlo',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'auto-zakaznik',
          sourceMultiplicity: '1',
          sourceRole: 'vlastnik',
          targetId: 'auto-vozidlo',
          targetMultiplicity: '1..*',
          targetRole: 'vozidla',
          label: 'vlastní'
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 4 (2.4): Generalizace, abstraktní třída a finální podoba diagramu
  // --------------------------------------------------------------------------
  {
    id: 'p-auto-04',
    order: 4,
    title: '2.4 Generalizace, abstraktní třída a finální podoba diagramu',
    shortTitle: '2.4 Hierarchie vozidel',
    storyIntro: 'Závěrečný krok mistrovského díla Autoservisu! Třída Vozidlo byla přepnuta na abstraktní s chráněnými prvky (#) – napoj k ní konkrétní podtřídy OsobniAuto a Dodavka.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-auto-03',
    assignmentTitle: 'Autoservis 4/4: Generalizace, abstraktní třída a finální podoba diagramu',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.3</strong> a dokončete jej do finální celistvé podoby převedením třídy <code>Vozidlo</code> na abstraktní nadtřídu a doplněním konkrétních specializací vozidel. Všechny ostatní dosavadní třídy a vazby zachovejte beze změny a proveďte přesně tyto úpravy:</p>
      <ul>
        <li><strong>Refaktoring třídy Vozidlo:</strong> Změňte třídu <code>Vozidlo</code> na <strong>abstraktní třídu</strong> (<code>abstract</code>). Změňte viditelnost atributů <code>najeteKm</code> (<code>int</code>) a <code>technickyZpusobile</code> (<code>boolean</code>) ze soukromé (<code>-</code>) na chráněnou (<code>#</code>) (atributy <code>vin</code>, <code>spz</code>, <code>znacka</code> a <code>rokVyroby</code> zůstávají soukromé <code>-</code>). Označte bezparametrické veřejné operace <code>+vypoctiZakladniSazbu(): BigDecimal</code> a <code>+ziskejTypVozidla(): String</code> jako abstraktní (<code>{abstract}</code>). Změňte viditelnost pomocné operace <code>overNajezd(noveKm: int): boolean</code> ze soukromé (<code>-</code>) na chráněnou (<code>#</code>) <em>(refaktoring třídy se automaticky projevil na tvém plátně)</em>.</li>
        <li><strong>Nová konkrétní podtřída OsobniAuto:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>pocetMist</code> typu <code>int</code>, <code>typKaroserie</code> typu <code>String</code> a <code>maTazneZarizeni</code> typu <code>boolean</code>. Přidejte tři veřejné operace (<code>+</code>): bezparametrickou operaci <code>vypoctiZakladniSazbu</code> vracející <code>BigDecimal</code>, bezparametrickou operaci <code>ziskejTypVozidla</code> vracející <code>String</code> a operaci <code>nastavTazneZarizeni</code> s parametrem <code>pritomno</code> typu <code>boolean</code> vracející <code>void</code>.</li>
        <li><strong>Nová konkrétní podtřída Dodavka:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>nosnostKg</code> typu <code>double</code> a <code>objemNakladuM3</code> typu <code>double</code>. Přidejte tři veřejné operace (<code>+</code>): bezparametrickou operaci <code>vypoctiZakladniSazbu</code> vracející <code>BigDecimal</code>, bezparametrickou operaci <code>ziskejTypVozidla</code> vracející <code>String</code> a operaci <code>jeNadLimitNosnosti</code> s parametrem <code>aktualniZatizeniKg</code> typu <code>double</code> vracející <code>boolean</code>. Dále přidejte jednu soukromou pomocnou operaci (<code>-</code>) <code>overZatizeni</code> s parametrem <code>zatizeniKg</code> typu <code>double</code> vracející <code>boolean</code>.</li>
        <li><strong>Nové vazby generalizace:</strong> Napojte obě nové podtřídy na abstraktní nadtřídu <code>Vozidlo</code> pomocí <strong>dvou vazeb generalizace</strong> (plná čára s prázdnou trojúhelníkovou šipkou směřující k <code>Vozidlo</code>): <code>OsobniAuto</code> dědí z <code>Vozidlo</code> a <code>Dodavka</code> dědí z <code>Vozidlo</code>.</li>
      </ul>
    `,
    requirements: [
      'Zachovejte všech 6 dosavadních tříd (včetně aktualizované abstraktní třídy <code>Vozidlo</code>) a všech 6 vazeb z kroku 2.3.',
      'Přidejte z palety konkrétní podtřídy <strong>OsobniAuto</strong> a <strong>Dodavka</strong>.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>OsobniAuto</code> (potomek) k <code>Vozidlo</code> (rodič) bez násobností.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>Dodavka</code> (potomek) k <code>Vozidlo</code> (rodič) bez násobností.'
    ],
    hints: [
      'U obou generalizací musí prázdný trojúhelník ukazovat na abstraktní nadtřídu Vozidlo (zdroj = OsobniAuto / Dodavka, cíl = Vozidlo) bez násobností.'
    ],
    classes: [
      AUTO_CLASS_AUTOSERVIS,
      AUTO_CLASS_MECHANIK,
      AUTO_CLASS_ZAKAZNIK,
      AUTO_CLASS_VOZIDLO_ABSTRACT,
      AUTO_CLASS_OSOBNI_AUTO,
      AUTO_CLASS_DODAVKA,
      AUTO_CLASS_ZAKAZKA_FULL,
      AUTO_CLASS_POLOZKA
    ],
    validationRules: {
      counts: { classifiers: 8, relations: 8 },
      expectedClasses: [
        'auto-autoservis',
        'auto-mechanik',
        'auto-zakaznik',
        'auto-vozidlo',
        'auto-osobni-auto',
        'auto-dodavka',
        'auto-zakazka',
        'auto-polozka'
      ],
      expectedRelations: [
        {
          id: 'auto-rel-autoservis-mechanik',
          type: 'aggregation',
          navigability: 'unidirectional',
          sourceId: 'auto-autoservis',
          sourceMultiplicity: '0..1',
          sourceRole: null,
          targetId: 'auto-mechanik',
          targetMultiplicity: '0..*',
          targetRole: 'mechanici',
          label: 'zaměstnává'
        },
        {
          id: 'auto-rel-autoservis-zakazka',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'auto-autoservis',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'auto-zakazka',
          targetMultiplicity: '0..*',
          targetRole: 'zakazky',
          label: 'eviduje'
        },
        {
          id: 'auto-rel-zakazka-polozka',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'auto-zakazka',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'auto-polozka',
          targetMultiplicity: '1..*',
          targetRole: 'polozky',
          label: 'obsahuje'
        },
        {
          id: 'auto-rel-zakazka-mechanik',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'auto-zakazka',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'auto-mechanik',
          targetMultiplicity: '0..1',
          targetRole: 'pridelenyMechanik',
          label: 'přidělena'
        },
        {
          id: 'auto-rel-zakazka-vozidlo',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'auto-zakazka',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'auto-vozidlo',
          targetMultiplicity: '1',
          targetRole: 'opravovaneVozidlo',
          label: 'opravuje'
        },
        {
          id: 'auto-rel-zakaznik-vozidlo',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'auto-zakaznik',
          sourceMultiplicity: '1',
          sourceRole: 'vlastnik',
          targetId: 'auto-vozidlo',
          targetMultiplicity: '1..*',
          targetRole: 'vozidla',
          label: 'vlastní'
        },
        {
          id: 'auto-rel-gen-osobni',
          type: 'generalization',
          sourceId: 'auto-osobni-auto',
          targetId: 'auto-vozidlo',
          feedback: {
            wrongType: 'Dědičnost mezi OsobniAuto a abstraktní třídou Vozidlo vyjádři generalizací (plná čára s prázdným trojúhelníkem).',
            wrongDirection: 'Šipka generalizace musí směřovat od podtřídy (OsobniAuto) k abstraktní nadtřídě (Vozidlo).'
          }
        },
        {
          id: 'auto-rel-gen-dodavka',
          type: 'generalization',
          sourceId: 'auto-dodavka',
          targetId: 'auto-vozidlo',
          feedback: {
            wrongType: 'Dědičnost mezi Dodavka a abstraktní třídou Vozidlo vyjádři generalizací (plná čára s prázdným trojúhelníkem).',
            wrongDirection: 'Šipka generalizace musí směřovat od podtřídy (Dodavka) k abstraktní nadtřídě (Vozidlo).'
          }
        }
      ]
    }
  }
];

export const AUTOSERVIS_CHAPTER = {
  id: 'ch-autoservis',
  type: 'practice',
  order: 2,
  title: 'Praxe 1: Autoservis',
  subtitle: 'Postupná stavba doménového modelu servisních zakázek',
  badge: 'Hlavní architekt Autoservisu',
  subchapters: RAW_AUTOSERVIS_SUBCHAPTERS.map((sub) => normalizePracticeSubchapter('ch-autoservis', sub))
};

// ============================================================================
// SDÍLENÉ DEFINICE TŘÍD PRO KAPITOLU 2: BANKA
// ============================================================================

const BANKA_CLASS_KLIENT = {
  id: 'banka-klient',
  kind: 'class',
  name: 'Klient',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'klientId', type: 'String', isStatic: false },
    { visibility: '-', name: 'jmeno', type: 'String', isStatic: false },
    { visibility: '-', name: 'prijmeni', type: 'String', isStatic: false },
    { visibility: '-', name: 'datumNarozeni', type: 'LocalDate', isStatic: false },
    { visibility: '-', name: 'email', type: 'String', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'pridejUcet', params: 'ucet: BankovniUcet', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejCelkovyZustatek', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'aktualizujEmail', params: 'novyEmail: String', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

const BANKA_CLASS_UCET_STEP1 = {
  id: 'banka-ucet',
  kind: 'class',
  name: 'BankovniUcet',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'cisloUctu', type: 'String', isStatic: false },
    { visibility: '-', name: 'zustatek', type: 'BigDecimal', isStatic: false },
    { visibility: '-', name: 'datumZalozeni', type: 'LocalDate', isStatic: false },
    { visibility: '-', name: 'aktivni', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vloz', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vyber', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejZustatek', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zablokujUcet', params: '', returnType: 'void', isAbstract: false, isStatic: false }
  ]
};

const BANKA_CLASS_UCET_STEP2_3 = {
  id: 'banka-ucet',
  kind: 'class',
  name: 'BankovniUcet',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'cisloUctu', type: 'String', isStatic: false },
    { visibility: '-', name: 'zustatek', type: 'BigDecimal', isStatic: false },
    { visibility: '-', name: 'datumZalozeni', type: 'LocalDate', isStatic: false },
    { visibility: '-', name: 'aktivni', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vloz', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vyber', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejZustatek', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zablokujUcet', params: '', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '-', name: 'pridejTransakci', params: 'transakce: Transakce', returnType: 'void', isAbstract: false, isStatic: false }
  ]
};

const BANKA_CLASS_UCET_ABSTRACT = {
  id: 'banka-ucet',
  kind: 'class',
  name: 'BankovniUcet',
  isAbstract: true,
  attributes: [
    { visibility: '-', name: 'cisloUctu', type: 'String', isStatic: false },
    { visibility: '#', name: 'zustatek', type: 'BigDecimal', isStatic: false },
    { visibility: '-', name: 'datumZalozeni', type: 'LocalDate', isStatic: false },
    { visibility: '#', name: 'aktivni', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vloz', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vyber', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: true, isStatic: false },
    { visibility: '+', name: 'ziskejZustatek', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zablokujUcet', params: '', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '#', name: 'pridejTransakci', params: 'transakce: Transakce', returnType: 'void', isAbstract: false, isStatic: false }
  ]
};

const BANKA_CLASS_KARTA = {
  id: 'banka-karta',
  kind: 'class',
  name: 'PlatebniKarta',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'cisloKarty', type: 'String', isStatic: false },
    { visibility: '-', name: 'pinHash', type: 'String', isStatic: false },
    { visibility: '-', name: 'datumExpirace', type: 'LocalDate', isStatic: false },
    { visibility: '-', name: 'denniLimit', type: 'BigDecimal', isStatic: false },
    { visibility: '-', name: 'zablokovana', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'overPin', params: 'zadanyPin: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zmenDenniLimit', params: 'novyLimit: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zablokujKartu', params: '', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'jePlatna', params: 'aktualniDatum: LocalDate', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

const BANKA_CLASS_TRANSAKCE = {
  id: 'banka-transakce',
  kind: 'class',
  name: 'Transakce',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'transakceId', type: 'String', isStatic: false },
    { visibility: '-', name: 'castka', type: 'BigDecimal', isStatic: false },
    { visibility: '-', name: 'typTransakce', type: 'String', isStatic: false },
    { visibility: '-', name: 'casProvedeni', type: 'LocalDateTime', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'ziskejCastku', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejCasProvedeni', params: '', returnType: 'LocalDateTime', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'jeKaretniTransakce', params: '', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

const BANKA_CLASS_BANKA = {
  id: 'banka-banka',
  kind: 'class',
  name: 'Banka',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'nazev', type: 'String', isStatic: false },
    { visibility: '-', name: 'kodBanky', type: 'String', isStatic: false },
    { visibility: '-', name: 'swiftKod', type: 'String', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'pridejPobocku', params: 'pobocka: Pobocka', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'najdiPobocku', params: 'kodPobocky: String', returnType: 'Pobocka', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejPocetPobocek', params: '', returnType: 'int', isAbstract: false, isStatic: false }
  ]
};

const BANKA_CLASS_POBOCKA = {
  id: 'banka-pobocka',
  kind: 'class',
  name: 'Pobocka',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'kodPobocky', type: 'String', isStatic: false },
    { visibility: '-', name: 'adresa', type: 'String', isStatic: false },
    { visibility: '-', name: 'mesto', type: 'String', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'priradKlienta', params: 'klient: Klient', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'odeberKlienta', params: 'klientId: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'najdiKlienta', params: 'klientId: String', returnType: 'Klient', isAbstract: false, isStatic: false }
  ]
};

const BANKA_CLASS_BEZNY_UCET = {
  id: 'banka-bezny-ucet',
  kind: 'class',
  name: 'BeznyUcet',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'kontokorentLimit', type: 'BigDecimal', isStatic: false },
    { visibility: '-', name: 'mesicniPoplatek', type: 'BigDecimal', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vyber', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vyberKartou', params: 'castka: BigDecimal, pin: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'nastavKontokorent', params: 'novyLimit: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vystavKartu', params: 'cisloKarty: String, pinHash: String, denniLimit: BigDecimal', returnType: 'PlatebniKarta', isAbstract: false, isStatic: false },
    { visibility: '-', name: 'overDostupnyZustatek', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

const BANKA_CLASS_SPORICI_UCET = {
  id: 'banka-sporici-ucet',
  kind: 'class',
  name: 'SporiciUcet',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'urokovaSazba', type: 'double', isStatic: false },
    { visibility: '-', name: 'minimalniZustatek', type: 'BigDecimal', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vyber', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'pripisUrok', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zmenUrokovouSazbu', params: 'novaSazba: double', returnType: 'void', isAbstract: false, isStatic: false }
  ]
};

// ============================================================================
// PRAKTICKÁ KAPITOLA 2: BANKA (4 NAVAZUJÍCÍ KROKY)
// ============================================================================

const RAW_BANKA_SUBCHAPTERS = [
  // --------------------------------------------------------------------------
  // Krok 1 (2.1): Základní třídy, zapouzdření a prostá asociace s násobnostmi
  // --------------------------------------------------------------------------
  {
    id: 'p-banka-01',
    order: 1,
    title: '2.1 Základní třídy, zapouzdření a prostá asociace s násobnostmi',
    shortTitle: '2.1 Klient a Účet',
    storyIntro: 'Vstupuješ do bankovního domu! Nejdříve postavíme základní stavební kámen finančního systému: vztah mezi klientem a jeho bankovními účty.',
    inheritPreviousCanvas: false,
    previousSubchapterId: null,
    assignmentTitle: 'Banka 1/4: Základní třídy, zapouzdření a prostá asociace s násobnostmi',
    assignmentHtml: `
      <p>Vytvořte výchozí návrhový diagram tříd (UML 2.5) pro doménu <strong>Banka</strong> určený pro implementaci v jazyce Java. Diagram v tomto prvním kroku obsahuje <strong>přesně dvě konkrétní třídy propojené jednou jednoduchou obousměrnou asociací</strong>. Odkazy mezi objekty vyjadřujte výhradně asociačními vazbami (neduplikujte je jako atributy uvnitř tříd) a nemodelujte konstruktory ani žádné nespecifikované atributy či metody.</p>
      <p>Vytvořte konkrétní třídu <strong>Klient</strong> se všemi atributy soukromými (<code>-</code>): <code>klientId</code> typu <code>String</code>, <code>jmeno</code> typu <code>String</code>, <code>prijmeni</code> typu <code>String</code>, <code>datumNarozeni</code> typu <code>LocalDate</code> a <code>email</code> typu <code>String</code>. Třída poskytuje tři veřejné operace (<code>+</code>): <code>pridejUcet</code> s parametrem <code>ucet</code> typu <code>BankovniUcet</code> vracející <code>void</code>, bezparametrickou operaci <code>ziskejCelkovyZustatek</code> vracející <code>BigDecimal</code> a operaci <code>aktualizujEmail</code> s parametrem <code>novyEmail</code> typu <code>String</code> vracející <code>boolean</code>.</p>
      <p>Vytvořte konkrétní třídu <strong>BankovniUcet</strong> (v tomto kroku zatím jako běžnou konkrétní třídu, nikoli abstraktní) se všemi atributy soukromými (<code>-</code>): <code>cisloUctu</code> typu <code>String</code>, <code>zustatek</code> typu <code>BigDecimal</code>, <code>datumZalozeni</code> typu <code>LocalDate</code> a <code>aktivni</code> typu <code>boolean</code>. Třída poskytuje čtyři veřejné operace (<code>+</code>): <code>vloz</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>, <code>vyber</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>, bezparametrickou operaci <code>ziskejZustatek</code> vracející <code>BigDecimal</code> a bezparametrickou operaci <code>zablokujUcet</code> vracející <code>void</code>.</p>
      <p>Třídy <strong>Klient</strong> a <strong>BankovniUcet</strong> propojte <strong>prostou obousměrnou asociací</strong> (plná čára bez šipek a bez kosočtverců) s popiskem <code>vlastní</code>. Každý bankovní účet patří vždy právě jednomu klientovi (násobnost <code>1</code> na straně <code>Klient</code>) a každý klient musí vlastnit alespoň jeden bankovní účet (násobnost <code>1..*</code> na straně <code>BankovniUcet</code>). Názvy rolí na koncích vazby v tomto kroku neuvádějte.</p>
    `,
    requirements: [
      'Umístěte na plátno konkrétní třídy <strong>Klient</strong> a <strong>BankovniUcet</strong>.',
      'Propojte je <strong>prostou obousměrnou asociací</strong> (plná čára bez šipek) s popiskem <code>vlastní</code>.',
      'Nastavte násobnosti: <code>1</code> na straně <code>Klient</code> a <code>1..*</code> na straně <code>BankovniUcet</code> (bez rolí).'
    ],
    hints: [
      'Rozmístěte třídy s dostatečným odstupem – v dalších krocích k nim přibudou Banka, Pobocka, Transakce, PlatebniKarta i specializované typy účtů.'
    ],
    classes: [
      BANKA_CLASS_KLIENT,
      BANKA_CLASS_UCET_STEP1
    ],
    validationRules: {
      counts: { classifiers: 2, relations: 1 },
      expectedClasses: ['banka-klient', 'banka-ucet'],
      expectedRelations: [
        {
          id: 'banka-rel-klient-ucet',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'banka-klient',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'banka-ucet',
          targetMultiplicity: '1..*',
          targetRole: null,
          label: 'vlastní',
          feedback: {
            wrongType: 'Mezi třídami Klient a BankovniUcet použij prostou obousměrnou asociaci (plná čára bez šipek a bez kosočtverců).',
            wrongSourceMultiplicity: 'U vazby Klient – BankovniUcet nastav na straně Klient násobnost "1" (každý bankovní účet patří právě jednomu klientovi).',
            wrongTargetMultiplicity: 'U vazby Klient – BankovniUcet zkontroluj násobnost na straně účtu (každý klient musí vlastnit alespoň jeden bankovní účet: 1..*).'
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 2 (2.2): Navigovatelnost asociací a role
  // --------------------------------------------------------------------------
  {
    id: 'p-banka-02',
    order: 2,
    title: '2.2 Navigovatelnost asociací a role',
    shortTitle: '2.2 Transakce a Karta',
    storyIntro: 'Na plátno se přenesly tvé třídy z minulého kroku a BankovniUcet získal soukromou operaci pridejTransakci. Doplň role u stávající vazby a zapoj evidenci transakcí i platebních karet.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-banka-01',
    assignmentTitle: 'Banka 2/4: Navigovatelnost asociací a role',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.1</strong> a rozšiřte jej o evidenci transakcí, platebních karet, směrování (navigovatelnost) asociací a názvy rolí. Všechny stávající třídy, atributy a metody z předchozího kroku zachovejte beze změny a proveďte přesně následující úpravy a doplnění:</p>
      <ul>
        <li><strong>Úprava stávající třídy BankovniUcet:</strong> Doplňte jednu soukromou operaci (<code>-</code>) <code>pridejTransakci</code> s parametrem <code>transakce</code> typu <code>Transakce</code> a návratovým typem <code>void</code> <em>(aktualizace se automaticky promítla na kartě třídy na plátně)</em>.</li>
        <li><strong>Úprava stávající vazby Klient – BankovniUcet (<code>vlastní</code>):</strong> Ponechte vazbu jako prostou obousměrnou asociaci se stejnými násobnostmi (<code>1</code> a <code>1..*</code>), ale doplňte názvy rolí na oba konce – na stranu <code>Klient</code> přidejte roli <code>vlastnik</code> a na stranu <code>BankovniUcet</code> přidejte roli <code>ucty</code>.</li>
        <li><strong>Nová konkrétní třída Transakce:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>transakceId</code> typu <code>String</code>, <code>castka</code> typu <code>BigDecimal</code>, <code>typTransakce</code> typu <code>String</code> a <code>casProvedeni</code> typu <code>LocalDateTime</code>. Přidejte tři veřejné bezparametrické operace (<code>+</code>): <code>ziskejCastku</code> vracející <code>BigDecimal</code>, <code>ziskejCasProvedeni</code> vracející <code>LocalDateTime</code> a <code>jeKaretniTransakce</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová konkrétní třída PlatebniKarta:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>cisloKarty</code> typu <code>String</code>, <code>pinHash</code> typu <code>String</code>, <code>datumExpirace</code> typu <code>LocalDate</code>, <code>denniLimit</code> typu <code>BigDecimal</code> a <code>zablokovana</code> typu <code>boolean</code>. Přidejte čtyři veřejné operace (<code>+</code>): <code>overPin</code> s parametrem <code>zadanyPin</code> typu <code>String</code> vracející <code>boolean</code>, <code>zmenDenniLimit</code> s parametrem <code>novyLimit</code> typu <code>BigDecimal</code> vracející <code>boolean</code>, bezparametrickou operaci <code>zablokujKartu</code> vracející <code>void</code> a operaci <code>jePlatna</code> s parametrem <code>aktualniDatum</code> typu <code>LocalDate</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová vazba BankovniUcet → Transakce:</strong> Vytvořte <strong>prostou jednosměrnou asociaci</strong> (v tomto kroku zatím bez kosočtverce) směřující z <code>BankovniUcet</code> na <code>Transakce</code> (šipka u <code>Transakce</code>) s popiskem <code>eviduje</code>. Na straně <code>BankovniUcet</code> uveďte násobnost <code>1</code> (bez role), na straně <code>Transakce</code> uveďte násobnost <code>0..*</code> a roli <code>transakce</code>.</li>
        <li><strong>Nová vazba Transakce → PlatebniKarta:</strong> Vytvořte <strong>prostou jednosměrnou asociaci</strong> směřující z <code>Transakce</code> na <code>PlatebniKarta</code> (šipka u <code>PlatebniKarta</code>) s popiskem <code>provedena pomocí</code>. Na straně <code>Transakce</code> uveďte násobnost <code>0..*</code> (bez role), na straně <code>PlatebniKarta</code> uveďte násobnost <code>0..1</code> a roli <code>pouzitaKarta</code>.</li>
      </ul>
    `,
    requirements: [
      'Upravte stávající vazbu <code>Klient – BankovniUcet</code>: doplňte roli <code>vlastnik</code> u <code>Klient</code> a roli <code>ucty</code> u <code>BankovniUcet</code>.',
      'Přidejte z palety nové třídy <strong>Transakce</strong> a <strong>PlatebniKarta</strong>.',
      'Vytvořte prostou jednosměrnou asociaci <code>BankovniUcet (1)</code> → <code>Transakce (0..*, role: transakce)</code> s popiskem <code>eviduje</code> (zatím bez kosočtverce).',
      'Vytvořte prostou jednosměrnou asociaci <code>Transakce (0..*)</code> → <code>PlatebniKarta (0..1, role: pouzitaKarta)</code> s popiskem <code>provedena pomocí</code>.'
    ],
    hints: [
      'V tomto kroku je vazba BankovniUcet → Transakce záměrně ještě prostou jednosměrnou asociací; na kompozici ji zpřesníme v kroku 2.3.'
    ],
    classes: [
      BANKA_CLASS_KLIENT,
      BANKA_CLASS_UCET_STEP2_3,
      BANKA_CLASS_KARTA,
      BANKA_CLASS_TRANSAKCE
    ],
    validationRules: {
      counts: { classifiers: 4, relations: 3 },
      expectedClasses: ['banka-klient', 'banka-ucet', 'banka-karta', 'banka-transakce'],
      expectedRelations: [
        {
          id: 'banka-rel-klient-ucet',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'banka-klient',
          sourceMultiplicity: '1',
          sourceRole: 'vlastnik',
          targetId: 'banka-ucet',
          targetMultiplicity: '1..*',
          targetRole: 'ucty',
          label: 'vlastní',
          feedback: {
            wrongSourceRole: 'Na stávající obousměrné vazbě Klient – BankovniUcet doplň na straně Klient roli "vlastnik".',
            wrongTargetRole: 'Na stávající obousměrné vazbě Klient – BankovniUcet doplň na straně BankovniUcet roli "ucty".'
          }
        },
        {
          id: 'banka-rel-ucet-transakce',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'banka-ucet',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'banka-transakce',
          targetMultiplicity: '0..*',
          targetRole: 'transakce',
          label: 'eviduje',
          feedback: {
            wrongType: 'V tomto kroku (2.2) modeluj vazbu BankovniUcet → Transakce zatím jako prostou jednosměrnou asociaci bez kosočtverce.',
            wrongTargetRole: 'U vazby BankovniUcet → Transakce doplň na straně Transakce roli "transakce".'
          }
        },
        {
          id: 'banka-rel-transakce-karta',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'banka-transakce',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'banka-karta',
          targetMultiplicity: '0..1',
          targetRole: 'pouzitaKarta',
          label: 'provedena pomocí',
          feedback: {
            wrongTargetMultiplicity: 'U vazby Transakce → PlatebniKarta nastav na straně PlatebniKarta násobnost "0..1" (bezhotovostní převod kartu nevyužívá).',
            wrongTargetRole: 'U vazby Transakce → PlatebniKarta doplň na straně PlatebniKarta roli "pouzitaKarta".'
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 3 (2.3): Vazby celek–část (agregace a kompozice)
  // --------------------------------------------------------------------------
  {
    id: 'p-banka-03',
    order: 3,
    title: '2.3 Vazby celek–část (agregace a kompozice)',
    shortTitle: '2.3 Banka, Pobočka a kompozice',
    storyIntro: 'Je čas přidat organizační páteř banky! Doplň třídy Banka a Pobocka, rozliš životní cyklus poboček a klientů a zpřesni vazbu účtu k transakcím na kompozici.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-banka-02',
    assignmentTitle: 'Banka 3/4: Vazby celek–část (agregace a kompozice)',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.2</strong> a doplňte organizační strukturu banky společně s vazbami typu celek–část (agregace a kompozice). Všechny dosavadní prvky z předchozího kroku zachovejte a proveďte přesně následující změny:</p>
      <ul>
        <li><strong>Nová konkrétní třída Banka:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>nazev</code> typu <code>String</code>, <code>kodBanky</code> typu <code>String</code> a <code>swiftKod</code> typu <code>String</code>. Přidejte tři veřejné operace (<code>+</code>): <code>pridejPobocku</code> s parametrem <code>pobocka</code> typu <code>Pobocka</code> vracející <code>void</code>, <code>najdiPobocku</code> s parametrem <code>kodPobocky</code> typu <code>String</code> vracející <code>Pobocka</code> a bezparametrickou operaci <code>ziskejPocetPobocek</code> vracející <code>int</code>.</li>
        <li><strong>Nová konkrétní třída Pobocka:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>kodPobocky</code> typu <code>String</code>, <code>adresa</code> typu <code>String</code> a <code>mesto</code> typu <code>String</code>. Přidejte tři veřejné operace (<code>+</code>): <code>priradKlienta</code> s parametrem <code>klient</code> typu <code>Klient</code> vracející <code>void</code>, <code>odeberKlienta</code> s parametrem <code>klientId</code> typu <code>String</code> vracející <code>boolean</code> a <code>najdiKlienta</code> s parametrem <code>klientId</code> typu <code>String</code> vracející <code>Klient</code>.</li>
        <li><strong>Nová kompozice Banka ◆→ Pobocka:</strong> Pobočka je existenčně závislou součástí banky a zaniká společně s ní. Vytvořte <strong>jednosměrnou kompozici</strong> z celku <code>Banka</code> (plný kosočtverec u <code>Banka</code>) k části <code>Pobocka</code> (šipka u <code>Pobocka</code>) s popiskem <code>provozuje</code>. Na straně <code>Banka</code> uveďte násobnost <code>1</code> (bez role), na straně <code>Pobocka</code> uveďte násobnost <code>1..*</code> a roli <code>pobocky</code>.</li>
        <li><strong>Nová agregace Pobocka ◇→ Klient:</strong> Pobočka sdružuje své kmenové klienty s nezávislým životním cyklem (při zrušení pobočky klienti nezanikají). Vytvořte <strong>jednosměrnou agregaci</strong> z celku <code>Pobocka</code> (prázdný kosočtverec u <code>Pobocka</code>) k části <code>Klient</code> (šipka u <code>Klient</code>) s popiskem <code>spravuje</code>. Na straně <code>Pobocka</code> uveďte násobnost <code>0..1</code> (bez role), na straně <code>Klient</code> uveďte násobnost <code>0..*</code> a roli <code>kmenoviKlienti</code>.</li>
        <li><strong>Zpřesnění stávající vazby BankovniUcet → Transakce (<code>eviduje</code>):</strong> Transakční záznamy jsou nedílnou součástí účtu a při jeho zrušení zanikají s ním. Změňte typ této stávající jednosměrné asociace na <strong>jednosměrnou kompozici</strong> (doplňte plný kosočtverec na stranu <code>BankovniUcet</code>); směr šipky k <code>Transakce</code>, násobnosti (<code>1</code> a <code>0..*</code>), roli <code>transakce</code> i popisek <code>eviduje</code> ponechte beze změny.</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající 4 třídy i vazby <code>Klient – BankovniUcet</code> a <code>Transakce → PlatebniKarta</code>.',
      'Přidejte z palety nové třídy <strong>Banka</strong> a <strong>Pobocka</strong>.',
      'Vytvořte jednosměrnou <strong>kompozici</strong> <code>Banka (1)</code> ◆→ <code>Pobocka (1..*, role: pobocky)</code> s popiskem <code>provozuje</code>.',
      'Vytvořte jednosměrnou <strong>agregaci</strong> <code>Pobocka (0..1)</code> ◇→ <code>Klient (0..*, role: kmenoviKlienti)</code> s popiskem <code>spravuje</code>.',
      'Klikněte na existující vazbu <code>BankovniUcet → Transakce</code> a změňte její typ na jednosměrnou <strong>kompozici</strong> (plný kosočtverec u <code>BankovniUcet</code>).'
    ],
    hints: [
      'Nezapomeňte kliknout na stávající vazbu BankovniUcet → Transakce a přepnout ji z prosté asociace na jednosměrnou kompozici (◆──>).'
    ],
    classes: [
      BANKA_CLASS_BANKA,
      BANKA_CLASS_POBOCKA,
      BANKA_CLASS_KLIENT,
      BANKA_CLASS_UCET_STEP2_3,
      BANKA_CLASS_KARTA,
      BANKA_CLASS_TRANSAKCE
    ],
    validationRules: {
      counts: { classifiers: 6, relations: 5 },
      expectedClasses: [
        'banka-banka',
        'banka-pobocka',
        'banka-klient',
        'banka-ucet',
        'banka-karta',
        'banka-transakce'
      ],
      expectedRelations: [
        {
          id: 'banka-rel-banka-pobocka',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'banka-banka',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'banka-pobocka',
          targetMultiplicity: '1..*',
          targetRole: 'pobocky',
          label: 'provozuje',
          feedback: {
            wrongType: 'Vazba mezi třídami Banka a Pobocka má nastavený jiný typ, ale pobočka nemůže existovat bez banky – použij jednosměrnou kompozici (plný kosočtverec).',
            wrongSourceMultiplicity: 'U kompozice Banka ◆→ Pobocka musí být na straně celku (Banka) násobnost "1".',
            wrongTargetMultiplicity: 'Banka musí provozovat alespoň jednu pobočku – na straně Pobocka uveď násobnost "1..*".',
            wrongTargetRole: 'U kompozice Banka ◆→ Pobocka uveď na straně Pobocka roli "pobocky".'
          }
        },
        {
          id: 'banka-rel-pobocka-klient',
          type: 'aggregation',
          navigability: 'unidirectional',
          sourceId: 'banka-pobocka',
          sourceMultiplicity: '0..1',
          sourceRole: null,
          targetId: 'banka-klient',
          targetMultiplicity: '0..*',
          targetRole: 'kmenoviKlienti',
          label: 'spravuje',
          feedback: {
            wrongType: 'Při zrušení pobočky klienti nezanikají (mají nezávislý životní cyklus) – mezi Pobocka a Klient použij jednosměrnou agregaci (prázdný kosočtverec).',
            wrongSourceMultiplicity: 'U agregace Pobocka ◇→ Klient uveď na straně Pobocka násobnost "0..1" (klient může existovat i bez kmenové pobočky).',
            wrongTargetRole: 'U agregace Pobocka ◇→ Klient uveď na straně Klient roli "kmenoviKlienti".'
          }
        },
        {
          id: 'banka-rel-klient-ucet',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'banka-klient',
          sourceMultiplicity: '1',
          sourceRole: 'vlastnik',
          targetId: 'banka-ucet',
          targetMultiplicity: '1..*',
          targetRole: 'ucty',
          label: 'vlastní'
        },
        {
          id: 'banka-rel-ucet-transakce',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'banka-ucet',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'banka-transakce',
          targetMultiplicity: '0..*',
          targetRole: 'transakce',
          label: 'eviduje',
          feedback: {
            wrongType: 'Stávající vazbu BankovniUcet → Transakce je v tomto kroku nutné zpřesnit z prosté asociace na jednosměrnou kompozici (plný kosočtverec u BankovniUcet).',
            wrongTargetRole: 'U kompozice BankovniUcet ◆→ Transakce ponech na straně Transakce roli "transakce".'
          }
        },
        {
          id: 'banka-rel-transakce-karta',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'banka-transakce',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'banka-karta',
          targetMultiplicity: '0..1',
          targetRole: 'pouzitaKarta',
          label: 'provedena pomocí'
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 4 (2.4): Generalizace, abstraktní třída a finální podoba diagramu
  // --------------------------------------------------------------------------
  {
    id: 'p-banka-04',
    order: 4,
    title: '2.4 Generalizace, abstraktní třída a finální podoba diagramu',
    shortTitle: '2.4 Hierarchie účtů a karta',
    storyIntro: 'Poslední krok bankovní architektury! BankovniUcet se proměnil v abstraktní nadtřídu s chráněnými prvky (#). Připoj konkrétní podtřídy BeznyUcet a SporiciUcet a napoj vydávání platební karty k běžnému účtu.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-banka-03',
    assignmentTitle: 'Banka 4/4: Generalizace, abstraktní třída a finální podoba diagramu',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.3</strong> a dokončete jej do finální celistvé podoby zavedením abstraktní nadtřídy, dědičné hierarchie typů účtů a vazby pro vydávání platebních karet. Všechny ostatní dosavadní třídy a vazby zachovejte beze změny a proveďte přesně tyto úpravy:</p>
      <ul>
        <li><strong>Refaktoring třídy BankovniUcet:</strong> Změňte třídu <code>BankovniUcet</code> na <strong>abstraktní třídu</strong> (<code>abstract</code>). Změňte viditelnost atributů <code>zustatek</code> (<code>BigDecimal</code>) a <code>aktivni</code> (<code>boolean</code>) ze soukromé (<code>-</code>) na chráněnou (<code>#</code>) (atributy <code>cisloUctu</code> a <code>datumZalozeni</code> zůstávají soukromé <code>-</code>). Označte veřejnou operaci <code>+vyber(castka: BigDecimal): boolean</code> jako abstraktní (<code>{abstract}</code>). Změňte viditelnost operace <code>pridejTransakci(transakce: Transakce): void</code> ze soukromé (<code>-</code>) na chráněnou (<code>#</code>) <em>(refaktoring třídy se automaticky projevil na tvém plátně)</em>.</li>
        <li><strong>Nová konkrétní podtřída BeznyUcet:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>kontokorentLimit</code> typu <code>BigDecimal</code> a <code>mesicniPoplatek</code> typu <code>BigDecimal</code>. Přidejte čtyři veřejné operace (<code>+</code>): <code>vyber</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>, <code>vyberKartou</code> s parametry <code>castka</code> typu <code>BigDecimal</code> a <code>pin</code> typu <code>String</code> vracející <code>boolean</code>, <code>nastavKontokorent</code> s parametrem <code>novyLimit</code> typu <code>BigDecimal</code> vracející <code>boolean</code> a <code>vystavKartu</code> s parametry <code>cisloKarty</code> typu <code>String</code>, <code>pinHash</code> typu <code>String</code> a <code>denniLimit</code> typu <code>BigDecimal</code> vracející <code>PlatebniKarta</code>. Dále přidejte jednu soukromou pomocnou operaci (<code>-</code>) <code>overDostupnyZustatek</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová konkrétní podtřída SporiciUcet:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>urokovaSazba</code> typu <code>double</code> a <code>minimalniZustatek</code> typu <code>BigDecimal</code>. Přidejte tři veřejné operace (<code>+</code>): <code>vyber</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>, bezparametrickou operaci <code>pripisUrok</code> vracející <code>BigDecimal</code> a operaci <code>zmenUrokovouSazbu</code> s parametrem <code>novaSazba</code> typu <code>double</code> vracející <code>void</code>.</li>
        <li><strong>Nové vazby generalizace:</strong> Napojte obě nové podtřídy na abstraktní nadtřídu <code>BankovniUcet</code> pomocí <strong>dvou vazeb generalizace</strong> (plná čára s prázdnou trojúhelníkovou šipkou směřující k <code>BankovniUcet</code>): <code>BeznyUcet</code> dědí z <code>BankovniUcet</code> a <code>SporiciUcet</code> dědí z <code>BankovniUcet</code>.</li>
        <li><strong>Nová kompozice BeznyUcet ◆→ PlatebniKarta:</strong> Platební kartu lze vydat výhradně k běžnému účtu, na němž je existenčně závislá a při jeho zrušení zaniká. Vytvořte <strong>jednosměrnou kompozici</strong> z celku <code>BeznyUcet</code> (plný kosočtverec u <code>BeznyUcet</code>) k části <code>PlatebniKarta</code> (šipka u <code>PlatebniKarta</code>) s popiskem <code>vydává</code>. Na straně <code>BeznyUcet</code> uveďte násobnost <code>1</code> (bez role), na straně <code>PlatebniKarta</code> uveďte násobnost <code>0..1</code> a roli <code>platebniKarta</code>.</li>
      </ul>
    `,
    requirements: [
      'Zachovejte všech 6 dosavadních tříd (včetně aktualizované abstraktní třídy <code>BankovniUcet</code>) a všech 5 vazeb z kroku 2.3.',
      'Přidejte z palety konkrétní podtřídy <strong>BeznyUcet</strong> a <strong>SporiciUcet</strong>.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>BeznyUcet</code> (potomek) k <code>BankovniUcet</code> (rodič) bez násobností.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>SporiciUcet</code> (potomek) k <code>BankovniUcet</code> (rodič) bez násobností.',
      'Vytvořte jednosměrnou <strong>kompozici</strong> <code>BeznyUcet (1)</code> ◆→ <code>PlatebniKarta (0..1, role: platebniKarta)</code> s popiskem <code>vydává</code>.'
    ],
    hints: [
      'Nezapomeňte kromě obou generalizací doplnit také jednosměrnou kompozici BeznyUcet (1) ◆→ PlatebniKarta (0..1, role platebniKarta) s popiskem vydává.'
    ],
    classes: [
      BANKA_CLASS_BANKA,
      BANKA_CLASS_POBOCKA,
      BANKA_CLASS_KLIENT,
      BANKA_CLASS_UCET_ABSTRACT,
      BANKA_CLASS_BEZNY_UCET,
      BANKA_CLASS_SPORICI_UCET,
      BANKA_CLASS_KARTA,
      BANKA_CLASS_TRANSAKCE
    ],
    validationRules: {
      counts: { classifiers: 8, relations: 8 },
      expectedClasses: [
        'banka-banka',
        'banka-pobocka',
        'banka-klient',
        'banka-ucet',
        'banka-bezny-ucet',
        'banka-sporici-ucet',
        'banka-karta',
        'banka-transakce'
      ],
      expectedRelations: [
        {
          id: 'banka-rel-banka-pobocka',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'banka-banka',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'banka-pobocka',
          targetMultiplicity: '1..*',
          targetRole: 'pobocky',
          label: 'provozuje'
        },
        {
          id: 'banka-rel-pobocka-klient',
          type: 'aggregation',
          navigability: 'unidirectional',
          sourceId: 'banka-pobocka',
          sourceMultiplicity: '0..1',
          sourceRole: null,
          targetId: 'banka-klient',
          targetMultiplicity: '0..*',
          targetRole: 'kmenoviKlienti',
          label: 'spravuje'
        },
        {
          id: 'banka-rel-klient-ucet',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'banka-klient',
          sourceMultiplicity: '1',
          sourceRole: 'vlastnik',
          targetId: 'banka-ucet',
          targetMultiplicity: '1..*',
          targetRole: 'ucty',
          label: 'vlastní'
        },
        {
          id: 'banka-rel-gen-bezny',
          type: 'generalization',
          sourceId: 'banka-bezny-ucet',
          targetId: 'banka-ucet',
          feedback: {
            wrongType: 'Dědičnost mezi BeznyUcet a abstraktní třídou BankovniUcet vyjádři generalizací (plná čára s prázdným trojúhelníkem).',
            wrongDirection: 'Šipka generalizace musí směřovat od podtřídy (BeznyUcet) k abstraktní nadtřídě (BankovniUcet).'
          }
        },
        {
          id: 'banka-rel-gen-sporici',
          type: 'generalization',
          sourceId: 'banka-sporici-ucet',
          targetId: 'banka-ucet',
          feedback: {
            wrongType: 'Dědičnost mezi SporiciUcet a abstraktní třídou BankovniUcet vyjádři generalizací (plná čára s prázdným trojúhelníkem).',
            wrongDirection: 'Šipka generalizace musí směřovat od podtřídy (SporiciUcet) k abstraktní nadtřídě (BankovniUcet).'
          }
        },
        {
          id: 'banka-rel-ucet-transakce',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'banka-ucet',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'banka-transakce',
          targetMultiplicity: '0..*',
          targetRole: 'transakce',
          label: 'eviduje'
        },
        {
          id: 'banka-rel-bezny-karta',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'banka-bezny-ucet',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'banka-karta',
          targetMultiplicity: '0..1',
          targetRole: 'platebniKarta',
          label: 'vydává',
          feedback: {
            wrongType: 'Platební karta je existenčně vázána na běžný účet – mezi BeznyUcet a PlatebniKarta použij jednosměrnou kompozici (plný kosočtverec u BeznyUcet).',
            wrongSourceMultiplicity: 'U kompozice BeznyUcet ◆→ PlatebniKarta musí být na straně celku (BeznyUcet) násobnost "1".',
            wrongTargetMultiplicity: 'K běžnému účtu lze vydat nejvýše jednu platební kartu (nebo žádnou) – na straně PlatebniKarta uveď násobnost "0..1".',
            wrongTargetRole: 'U kompozice BeznyUcet ◆→ PlatebniKarta uveď na straně PlatebniKarta roli "platebniKarta".'
          }
        },
        {
          id: 'banka-rel-transakce-karta',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'banka-transakce',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'banka-karta',
          targetMultiplicity: '0..1',
          targetRole: 'pouzitaKarta',
          label: 'provedena pomocí'
        }
      ]
    }
  }
];

export const BANKA_CHAPTER = {
  id: 'ch-banka',
  type: 'practice',
  order: 3,
  title: 'Praxe 2: Banka',
  subtitle: 'Klienti, účty, transakce, karty a pobočková síť',
  badge: 'Strážce bankovních struktur',
  subchapters: RAW_BANKA_SUBCHAPTERS.map((sub) => normalizePracticeSubchapter('ch-banka', sub))
};

// ============================================================================
// SDÍLENÉ DEFINICE TŘÍD PRO KAPITOLU 3: GEOMETRIE (MALOVÁNÍ)
// ============================================================================

const GEO_CLASS_TVAR_CONCRETE = {
  id: 'geo-tvar',
  kind: 'class',
  name: 'Tvar',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'tvarId', type: 'String', isStatic: false },
    { visibility: '-', name: 'rotaceStupne', type: 'double', isStatic: false },
    { visibility: '-', name: 'viditelny', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vypoctiObsah', params: '', returnType: 'double', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vypoctiObvod', params: '', returnType: 'double', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vykresli', params: '', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'posun', params: 'dx: double, dy: double', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'otoc', params: 'uhelStupne: double', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'priradStyl', params: 'styl: Styl', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '-', name: 'normalizujUhel', params: 'uhel: double', returnType: 'double', isAbstract: false, isStatic: false }
  ]
};

const GEO_CLASS_TVAR_ABSTRACT = {
  id: 'geo-tvar',
  kind: 'class',
  name: 'Tvar',
  isAbstract: true,
  attributes: [
    { visibility: '-', name: 'tvarId', type: 'String', isStatic: false },
    { visibility: '#', name: 'rotaceStupne', type: 'double', isStatic: false },
    { visibility: '#', name: 'viditelny', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vypoctiObsah', params: '', returnType: 'double', isAbstract: true, isStatic: false },
    { visibility: '+', name: 'vypoctiObvod', params: '', returnType: 'double', isAbstract: true, isStatic: false },
    { visibility: '+', name: 'vykresli', params: '', returnType: 'void', isAbstract: true, isStatic: false },
    { visibility: '+', name: 'posun', params: 'dx: double, dy: double', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'otoc', params: 'uhelStupne: double', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'priradStyl', params: 'styl: Styl', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '#', name: 'normalizujUhel', params: 'uhel: double', returnType: 'double', isAbstract: false, isStatic: false }
  ]
};

const GEO_CLASS_STYL = {
  id: 'geo-styl',
  kind: 'class',
  name: 'Styl',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'stylId', type: 'String', isStatic: false },
    { visibility: '-', name: 'barvaVyplne', type: 'String', isStatic: false },
    { visibility: '-', name: 'barvaObrysu', type: 'String', isStatic: false },
    { visibility: '-', name: 'tloustkaObrysu', type: 'double', isStatic: false },
    { visibility: '-', name: 'pruhlednost', type: 'double', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'zmenBarvuVyplne', params: 'hexBarva: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zmenBarvuObrysu', params: 'hexBarva: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'nastavTloustkuObrysu', params: 'tloustka: double', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '-', name: 'jePlatnaHexBarva', params: 'hexBarva: String', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

const GEO_CLASS_PLATNO_BASE = {
  id: 'geo-platno',
  kind: 'class',
  name: 'Platno',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'nazev', type: 'String', isStatic: false },
    { visibility: '-', name: 'sirkaPx', type: 'int', isStatic: false },
    { visibility: '-', name: 'vyskaPx', type: 'int', isStatic: false },
    { visibility: '-', name: 'barvaPozadi', type: 'String', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'oznacTvar', params: 'tvar: Tvar', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zrusOznaceni', params: '', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vykresli', params: '', returnType: 'void', isAbstract: false, isStatic: false }
  ]
};

const GEO_CLASS_PLATNO_FULL = {
  id: 'geo-platno',
  kind: 'class',
  name: 'Platno',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'nazev', type: 'String', isStatic: false },
    { visibility: '-', name: 'sirkaPx', type: 'int', isStatic: false },
    { visibility: '-', name: 'vyskaPx', type: 'int', isStatic: false },
    { visibility: '-', name: 'barvaPozadi', type: 'String', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'pridejVrstvu', params: 'vrstva: Vrstva', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'odeberVrstvu', params: 'vrstvaId: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'oznacTvar', params: 'tvar: Tvar', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zrusOznaceni', params: '', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vykresli', params: '', returnType: 'void', isAbstract: false, isStatic: false }
  ]
};

const GEO_CLASS_BOD = {
  id: 'geo-bod',
  kind: 'class',
  name: 'Bod',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'x', type: 'double', isStatic: false },
    { visibility: '-', name: 'y', type: 'double', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'posunO', params: 'dx: double, dy: double', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vzdalenostOd', params: 'cilovyBod: Bod', returnType: 'double', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejX', params: '', returnType: 'double', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejY', params: '', returnType: 'double', isAbstract: false, isStatic: false }
  ]
};

const GEO_CLASS_VRSTVA = {
  id: 'geo-vrstva',
  kind: 'class',
  name: 'Vrstva',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'vrstvaId', type: 'String', isStatic: false },
    { visibility: '-', name: 'nazev', type: 'String', isStatic: false },
    { visibility: '-', name: 'poradiZ', type: 'int', isStatic: false },
    { visibility: '-', name: 'viditelna', type: 'boolean', isStatic: false },
    { visibility: '-', name: 'zamcena', type: 'boolean', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'pridejTvar', params: 'tvar: Tvar', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'odeberTvar', params: 'tvarId: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'najdiTvar', params: 'tvarId: String', returnType: 'Tvar', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'nastavViditelnost', params: 'viditelna: boolean', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejPocetTvaru', params: '', returnType: 'int', isAbstract: false, isStatic: false }
  ]
};

const GEO_CLASS_PALETA = {
  id: 'geo-paleta',
  kind: 'class',
  name: 'Paleta',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'nazev', type: 'String', isStatic: false },
    { visibility: '-', name: 'popis', type: 'String', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'pridejStyl', params: 'styl: Styl', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'odeberStyl', params: 'stylId: String', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'najdiStyl', params: 'stylId: String', returnType: 'Styl', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'ziskejPocetStylu', params: '', returnType: 'int', isAbstract: false, isStatic: false }
  ]
};

const GEO_CLASS_KRUH = {
  id: 'geo-kruh',
  kind: 'class',
  name: 'Kruh',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'polomer', type: 'double', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vypoctiObsah', params: '', returnType: 'double', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vypoctiObvod', params: '', returnType: 'double', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vykresli', params: '', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zmenPolomer', params: 'novyPolomer: double', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'obsahujeBod', params: 'bod: Bod', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

const GEO_CLASS_OBDELNIK = {
  id: 'geo-obdelnik',
  kind: 'class',
  name: 'Obdelnik',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'sirka', type: 'double', isStatic: false },
    { visibility: '-', name: 'vyska', type: 'double', isStatic: false },
    { visibility: '-', name: 'zaobleniRohu', type: 'double', isStatic: false }
  ],
  methods: [
    { visibility: '+', name: 'vypoctiObsah', params: '', returnType: 'double', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vypoctiObvod', params: '', returnType: 'double', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'vykresli', params: '', returnType: 'void', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'zmenRozmery', params: 'novaSirka: double, novaVyska: double', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '+', name: 'jeCtverec', params: '', returnType: 'boolean', isAbstract: false, isStatic: false },
    { visibility: '-', name: 'overRozmery', params: 'sirka: double, vyska: double', returnType: 'boolean', isAbstract: false, isStatic: false }
  ]
};

// ============================================================================
// PRAKTICKÁ KAPITOLA 3: GEOMETRIE (MALOVÁNÍ) (4 NAVAZUJÍCÍ KROKY)
// ============================================================================

const RAW_GEOMETRIE_SUBCHAPTERS = [
  // --------------------------------------------------------------------------
  // Krok 1 (2.1): Základní třídy, zapouzdření a prostá asociace s násobnostmi
  // --------------------------------------------------------------------------
  {
    id: 'p-geo-01',
    order: 1,
    title: '2.1 Základní třídy, zapouzdření a prostá asociace s násobnostmi',
    shortTitle: '2.1 Tvar a Styl',
    storyIntro: 'Vítej v ateliéru vektorové grafiky! Nejprve založíme jádro grafického editoru: propojíme geometrický tvar s jeho vizuálním stylem pomocí prosté obousměrné asociace.',
    inheritPreviousCanvas: false,
    previousSubchapterId: null,
    assignmentTitle: 'Geometrie 1/4: Základní třídy, zapouzdření a prostá asociace s násobnostmi',
    assignmentHtml: `
      <p>Vytvořte výchozí návrhový diagram tříd (UML 2.5) pro doménu <strong>Geometrie (Malování)</strong> určený pro implementaci v jazyce Java. Diagram v tomto prvním kroku obsahuje <strong>přesně dvě konkrétní třídy propojené jednou jednoduchou obousměrnou asociací</strong>. Odkazy mezi objekty vyjadřujte výhradně asociačními vazbami (neduplikujte je jako atributy uvnitř tříd) a nemodelujte konstruktory ani žádné nespecifikované atributy či metody.</p>
      <p>Vytvořte konkrétní třídu <strong>Tvar</strong> (v tomto kroku zatím jako běžnou konkrétní třídu, nikoli abstraktní) se všemi atributy soukromými (<code>-</code>): <code>tvarId</code> typu <code>String</code>, <code>rotaceStupne</code> typu <code>double</code> a <code>viditelny</code> typu <code>boolean</code>. Třída poskytuje šest veřejných operací (<code>+</code>): bezparametrické operace <code>vypoctiObsah</code> vracející <code>double</code>, <code>vypoctiObvod</code> vracející <code>double</code> a <code>vykresli</code> vracející <code>void</code>, dále operaci <code>posun</code> s parametry <code>dx</code> typu <code>double</code> a <code>dy</code> typu <code>double</code> vracející <code>void</code>, operaci <code>otoc</code> s parametrem <code>uhelStupne</code> typu <code>double</code> vracející <code>void</code> a operaci <code>priradStyl</code> s parametrem <code>styl</code> typu <code>Styl</code> vracející <code>void</code>. Dále obsahuje jednu soukromou pomocnou operaci (<code>-</code>) <code>normalizujUhel</code> s parametrem <code>uhel</code> typu <code>double</code> vracející <code>double</code>.</p>
      <p>Vytvořte konkrétní třídu <strong>Styl</strong> se všemi atributy soukromými (<code>-</code>): <code>stylId</code> typu <code>String</code>, <code>barvaVyplne</code> typu <code>String</code>, <code>barvaObrysu</code> typu <code>String</code>, <code>tloustkaObrysu</code> typu <code>double</code> a <code>pruhlednost</code> typu <code>double</code>. Třída poskytuje tři veřejné operace (<code>+</code>): <code>zmenBarvuVyplne</code> s parametrem <code>hexBarva</code> typu <code>String</code> vracející <code>boolean</code>, <code>zmenBarvuObrysu</code> s parametrem <code>hexBarva</code> typu <code>String</code> vracející <code>boolean</code> a <code>nastavTloustkuObrysu</code> s parametrem <code>tloustka</code> typu <code>double</code> vracející <code>boolean</code>. Dále obsahuje jednu soukromou validační operaci (<code>-</code>) <code>jePlatnaHexBarva</code> s parametrem <code>hexBarva</code> typu <code>String</code> vracející <code>boolean</code>.</p>
      <p>Třídy <strong>Tvar</strong> a <strong>Styl</strong> propojte <strong>prostou obousměrnou asociací</strong> (plná čára bez šipek a bez kosočtverců) s popiskem <code>používá</code>. Jeden styl může používat libovolný počet tvarů nebo žádný (násobnost <code>0..*</code> na straně <code>Tvar</code>) a každý tvar může mít přiřazen nejvýše jeden styl nebo žádný (násobnost <code>0..1</code> na straně <code>Styl</code>). Názvy rolí na koncích vazby v tomto kroku neuvádějte.</p>
    `,
    requirements: [
      'Umístěte na plátno konkrétní třídy <strong>Tvar</strong> a <strong>Styl</strong>.',
      'Propojte je <strong>prostou obousměrnou asociací</strong> (plná čára bez šipek) s popiskem <code>používá</code>.',
      'Nastavte násobnosti: <code>0..*</code> na straně <code>Tvar</code> a <code>0..1</code> na straně <code>Styl</code> (bez rolí).'
    ],
    hints: [
      'Nechte si kolem tříd Tvar a Styl dostatek volného prostoru – v dalších krocích kolem nich vyrostou Platno, Vrstva, Bod, Paleta i konkrétní tvary Kruh a Obdelnik.'
    ],
    classes: [
      GEO_CLASS_TVAR_CONCRETE,
      GEO_CLASS_STYL
    ],
    validationRules: {
      counts: { classifiers: 2, relations: 1 },
      expectedClasses: ['geo-tvar', 'geo-styl'],
      expectedRelations: [
        {
          id: 'geo-rel-tvar-styl',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'geo-tvar',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'geo-styl',
          targetMultiplicity: '0..1',
          targetRole: null,
          label: 'používá',
          feedback: {
            wrongType: 'Mezi třídami Tvar a Styl použij prostou obousměrnou asociaci (plná čára bez šipek a bez kosočtverců).',
            wrongSourceMultiplicity: 'U vazby Tvar – Styl nastav na straně Tvar násobnost "0..*" (jeden styl může používat nula až libovolný počet tvarů).',
            wrongTargetMultiplicity: 'U vazby Tvar – Styl nastav na straně Styl násobnost "0..1" (tvar může mít přiřazen nejvýše jeden styl nebo žádný).'
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 2 (2.2): Navigovatelnost asociací a role
  // --------------------------------------------------------------------------
  {
    id: 'p-geo-02',
    order: 2,
    title: '2.2 Navigovatelnost asociací a role',
    shortTitle: '2.2 Plátno a Kotevní bod',
    storyIntro: 'Skvěle! Teď na plátno doplníme pracovní Platno a souřadnicový Bod. Uprav stávající vazbu o role a přidej dvě jednosměrné asociace pro výběr tvaru a jeho polohu.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-geo-01',
    assignmentTitle: 'Geometrie 2/4: Navigovatelnost asociací a role',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.1</strong> a rozšiřte jej o pracovní plátno, kotevní bod tvarů, jednosměrnou navigovatelnost asociací a názvy rolí. Všechny stávající třídy, atributy a metody z předchozího kroku zachovejte beze změny a proveďte přesně následující úpravy a doplnění:</p>
      <ul>
        <li><strong>Úprava stávající vazby Tvar – Styl (<code>používá</code>):</strong> Ponechte vazbu jako prostou obousměrnou asociaci se stejnými násobnostmi (<code>0..*</code> a <code>0..1</code>), ale doplňte názvy rolí na oba konce – na stranu <code>Tvar</code> přidejte roli <code>pouzivajiciTvary</code> a na stranu <code>Styl</code> přidejte roli <code>styl</code>.</li>
        <li><strong>Nová konkrétní třída Platno</strong> (základní rozsah před zavedením vrstev): Přidejte třídu se soukromými atributy (<code>-</code>): <code>nazev</code> typu <code>String</code>, <code>sirkaPx</code> typu <code>int</code>, <code>vyskaPx</code> typu <code>int</code> a <code>barvaPozadi</code> typu <code>String</code>. Přidejte tři veřejné operace (<code>+</code>): <code>oznacTvar</code> s parametrem <code>tvar</code> typu <code>Tvar</code> vracející <code>void</code>, bezparametrickou operaci <code>zrusOznaceni</code> vracející <code>void</code> a bezparametrickou operaci <code>vykresli</code> vracející <code>void</code>.</li>
        <li><strong>Nová konkrétní třída Bod:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>x</code> typu <code>double</code> a <code>y</code> typu <code>double</code>. Přidejte čtyři veřejné operace (<code>+</code>): <code>posunO</code> s parametry <code>dx</code> typu <code>double</code> a <code>dy</code> typu <code>double</code> vracející <code>void</code>, <code>vzdalenostOd</code> s parametrem <code>cilovyBod</code> typu <code>Bod</code> vracející <code>double</code>, bezparametrickou operaci <code>ziskejX</code> vracející <code>double</code> a bezparametrickou operaci <code>ziskejY</code> vracející <code>double</code>.</li>
        <li><strong>Nová vazba Platno → Tvar:</strong> Vytvořte <strong>prostou jednosměrnou asociaci</strong> směřující z <code>Platno</code> na <code>Tvar</code> (šipka u <code>Tvar</code>) s popiskem <code>označuje</code>. Na straně <code>Platno</code> uveďte násobnost <code>0..1</code> (bez role), na straně <code>Tvar</code> uveďte násobnost <code>0..1</code> a roli <code>oznacenyTvar</code>.</li>
        <li><strong>Nová vazba Tvar → Bod:</strong> Vytvořte <strong>prostou jednosměrnou asociaci</strong> (v tomto kroku zatím bez kosočtverce) směřující z <code>Tvar</code> na <code>Bod</code> (šipka u <code>Bod</code>) s popiskem <code>definuje polohu</code>. Na straně <code>Tvar</code> uveďte násobnost <code>1</code> (bez role), na straně <code>Bod</code> uveďte násobnost <code>1</code> a roli <code>kotevniBod</code>.</li>
      </ul>
    `,
    requirements: [
      'Klikněte na stávající vazbu <code>Tvar – Styl</code> a doplňte role: <code>pouzivajiciTvary</code> u <code>Tvar</code> a <code>styl</code> u <code>Styl</code>.',
      'Přidejte z palety nové třídy <strong>Platno</strong> a <strong>Bod</strong>.',
      'Vytvořte prostou jednosměrnou asociaci <code>Platno (0..1)</code> → <code>Tvar (0..1, role: oznacenyTvar)</code> s popiskem <code>označuje</code>.',
      'Vytvořte prostou jednosměrnou asociaci <code>Tvar (1)</code> → <code>Bod (1, role: kotevniBod)</code> s popiskem <code>definuje polohu</code> (zatím bez kosočtverce).'
    ],
    hints: [
      'V tomto kroku je vazba Tvar → Bod záměrně ještě prostou jednosměrnou asociací bez kosočtverce; na kompozici ji změníme v dalším kroku.'
    ],
    classes: [
      GEO_CLASS_PLATNO_BASE,
      GEO_CLASS_TVAR_CONCRETE,
      GEO_CLASS_BOD,
      GEO_CLASS_STYL
    ],
    validationRules: {
      counts: { classifiers: 4, relations: 3 },
      expectedClasses: ['geo-platno', 'geo-tvar', 'geo-bod', 'geo-styl'],
      expectedRelations: [
        {
          id: 'geo-rel-platno-tvar',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'geo-platno',
          sourceMultiplicity: '0..1',
          sourceRole: null,
          targetId: 'geo-tvar',
          targetMultiplicity: '0..1',
          targetRole: 'oznacenyTvar',
          label: 'označuje',
          feedback: {
            wrongSourceMultiplicity: 'U vazby Platno → Tvar nastav na straně Platno násobnost "0..1".',
            wrongTargetMultiplicity: 'U vazby Platno → Tvar nastav na straně Tvar násobnost "0..1" (na plátně nemusí být vybrán žádný tvar, nebo nejvýše jeden).',
            wrongTargetRole: 'U vazby Platno → Tvar doplň na straně Tvar roli "oznacenyTvar".'
          }
        },
        {
          id: 'geo-rel-tvar-bod',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'geo-tvar',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'geo-bod',
          targetMultiplicity: '1',
          targetRole: 'kotevniBod',
          label: 'definuje polohu',
          feedback: {
            wrongType: 'V tomto kroku (2.2) modeluj vazbu Tvar → Bod zatím jako prostou jednosměrnou asociaci bez kosočtverce.',
            wrongTargetRole: 'U vazby Tvar → Bod doplň na straně Bod roli "kotevniBod".'
          }
        },
        {
          id: 'geo-rel-tvar-styl',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'geo-tvar',
          sourceMultiplicity: '0..*',
          sourceRole: 'pouzivajiciTvary',
          targetId: 'geo-styl',
          targetMultiplicity: '0..1',
          targetRole: 'styl',
          label: 'používá',
          feedback: {
            wrongSourceRole: 'Na stávající obousměrné vazbě Tvar – Styl doplň na straně Tvar roli "pouzivajiciTvary".',
            wrongTargetRole: 'Na stávající obousměrné vazbě Tvar – Styl doplň na straně Styl roli "styl".'
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 3 (2.3): Vazby celek–část (agregace a kompozice)
  // --------------------------------------------------------------------------
  {
    id: 'p-geo-03',
    order: 3,
    title: '2.3 Vazby celek–část (agregace a kompozice)',
    shortTitle: '2.3 Vrstvy, Paleta a kompozice',
    storyIntro: 'Třída Platno automaticky získala operace pro správu vrstev. Teď model obohať o Vrstvu, Paletu, silné kompozice (včetně zpřesnění vazby k Bodu) a slabou agregaci palety stylů.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-geo-02',
    assignmentTitle: 'Geometrie 3/4: Vazby celek–část (agregace a kompozice)',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.2</strong> a rozšiřte jej o vrstvy plátna, tematické palety stylů a vazby typu celek–část (agregace a kompozice). Všechny dosavadní prvky z předchozího kroku zachovejte a proveďte přesně následující změny:</p>
      <ul>
        <li><strong>Úprava stávající třídy Platno:</strong> Doplňte dvě veřejné operace (<code>+</code>) pro správu vrstev: <code>pridejVrstvu</code> s parametrem <code>vrstva</code> typu <code>Vrstva</code> vracející <code>void</code> a <code>odeberVrstvu</code> s parametrem <code>vrstvaId</code> typu <code>String</code> vracející <code>boolean</code> <em>(aktualizace se automaticky promítla na kartě třídy na plátně)</em>.</li>
        <li><strong>Nová konkrétní třída Vrstva:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>vrstvaId</code> typu <code>String</code>, <code>nazev</code> typu <code>String</code>, <code>poradiZ</code> typu <code>int</code>, <code>viditelna</code> typu <code>boolean</code> a <code>zamcena</code> typu <code>boolean</code>. Přidejte pět veřejných operací (<code>+</code>): <code>pridejTvar</code> s parametrem <code>tvar</code> typu <code>Tvar</code> vracející <code>boolean</code>, <code>odeberTvar</code> s parametrem <code>tvarId</code> typu <code>String</code> vracející <code>boolean</code>, <code>najdiTvar</code> s parametrem <code>tvarId</code> typu <code>String</code> vracející <code>Tvar</code>, <code>nastavViditelnost</code> s parametrem <code>viditelna</code> typu <code>boolean</code> vracející <code>void</code> a bezparametrickou operaci <code>ziskejPocetTvaru</code> vracející <code>int</code>.</li>
        <li><strong>Nová konkrétní třída Paleta:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>nazev</code> typu <code>String</code> a <code>popis</code> typu <code>String</code>. Přidejte čtyři veřejné operace (<code>+</code>): <code>pridejStyl</code> s parametrem <code>styl</code> typu <code>Styl</code> vracející <code>void</code>, <code>odeberStyl</code> s parametrem <code>stylId</code> typu <code>String</code> vracející <code>boolean</code>, <code>najdiStyl</code> s parametrem <code>stylId</code> typu <code>String</code> vracející <code>Styl</code> a bezparametrickou operaci <code>ziskejPocetStylu</code> vracející <code>int</code>.</li>
        <li><strong>Nová kompozice Platno ◆→ Vrstva:</strong> Vrstva je existenčně závislou součástí plátna a při jeho odstranění zaniká. Vytvořte <strong>jednosměrnou kompozici</strong> z celku <code>Platno</code> (plný kosočtverec u <code>Platno</code>) k části <code>Vrstva</code> (šipka u <code>Vrstva</code>) s popiskem <code>obsahuje</code>. Na straně <code>Platno</code> uveďte násobnost <code>1</code> (bez role), na straně <code>Vrstva</code> uveďte násobnost <code>1..*</code> a roli <code>vrstvy</code>.</li>
        <li><strong>Nová kompozice Vrstva ◆→ Tvar:</strong> Nakreslené tvary jsou existenčně svázány se svou vrstvou a při jejím smazání zanikají. Vytvořte <strong>jednosměrnou kompozici</strong> z celku <code>Vrstva</code> (plný kosočtverec u <code>Vrstva</code>) k části <code>Tvar</code> (šipka u <code>Tvar</code>) s popiskem <code>eviduje</code>. Na straně <code>Vrstva</code> uveďte násobnost <code>1</code> (bez role), na straně <code>Tvar</code> uveďte násobnost <code>0..*</code> a roli <code>tvary</code>.</li>
        <li><strong>Zpřesnění stávající vazby Tvar → Bod (<code>definuje polohu</code>):</strong> Kotevní bod je neoddělitelnou součástí tvaru a zaniká společně s ním. Změňte typ této stávající jednosměrné asociace na <strong>jednosměrnou kompozici</strong> (doplňte plný kosočtverec na stranu <code>Tvar</code>); směr šipky k <code>Bod</code>, násobnosti (<code>1</code> a <code>1</code>), roli <code>kotevniBod</code> i popisek <code>definuje polohu</code> ponechte beze změny.</li>
        <li><strong>Nová agregace Paleta ◇→ Styl:</strong> Paleta sdružuje styly s nezávislým životním cyklem (při smazání palety styly v systému nadále existují). Vytvořte <strong>jednosměrnou agregaci</strong> z celku <code>Paleta</code> (prázdný kosočtverec u <code>Paleta</code>) k části <code>Styl</code> (šipka u <code>Styl</code>) s popiskem <code>sdružuje</code>. Na straně <code>Paleta</code> uveďte násobnost <code>0..1</code> (bez role), na straně <code>Styl</code> uveďte násobnost <code>0..*</code> a roli <code>styly</code>.</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající 4 třídy i vazby <code>Platno → Tvar</code> a <code>Tvar – Styl</code>.',
      'Přidejte z palety nové třídy <strong>Vrstva</strong> a <strong>Paleta</strong>.',
      'Vytvořte jednosměrnou <strong>kompozici</strong> <code>Platno (1)</code> ◆→ <code>Vrstva (1..*, role: vrstvy)</code> s popiskem <code>obsahuje</code>.',
      'Vytvořte jednosměrnou <strong>kompozici</strong> <code>Vrstva (1)</code> ◆→ <code>Tvar (0..*, role: tvary)</code> s popiskem <code>eviduje</code>.',
      'Klikněte na stávající vazbu <code>Tvar → Bod</code> a přepněte ji na jednosměrnou <strong>kompozici</strong> (plný kosočtverec u <code>Tvar</code>).',
      'Vytvořte jednosměrnou <strong>agregaci</strong> <code>Paleta (0..1)</code> ◇→ <code>Styl (0..*, role: styly)</code> s popiskem <code>sdružuje</code>.'
    ],
    hints: [
      'Nezapomeňte upravit existující vazbu Tvar → Bod na kompozici (◆──>) a ponechat původní vazbu Platno → Tvar jako prostou jednosměrnou asociaci (označuje).'
    ],
    classes: [
      GEO_CLASS_PLATNO_FULL,
      GEO_CLASS_VRSTVA,
      GEO_CLASS_TVAR_CONCRETE,
      GEO_CLASS_BOD,
      GEO_CLASS_STYL,
      GEO_CLASS_PALETA
    ],
    validationRules: {
      counts: { classifiers: 6, relations: 6 },
      expectedClasses: [
        'geo-platno',
        'geo-vrstva',
        'geo-tvar',
        'geo-bod',
        'geo-styl',
        'geo-paleta'
      ],
      expectedRelations: [
        {
          id: 'geo-rel-platno-vrstva',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'geo-platno',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'geo-vrstva',
          targetMultiplicity: '1..*',
          targetRole: 'vrstvy',
          label: 'obsahuje',
          feedback: {
            wrongType: 'Vrstva nemůže existovat bez plátna – mezi Platno a Vrstva použij jednosměrnou kompozici (plný kosočtverec u Platno).',
            wrongSourceMultiplicity: 'U kompozice Platno ◆→ Vrstva musí být na straně celku (Platno) násobnost "1".',
            wrongTargetMultiplicity: 'Každé plátno musí obsahovat alespoň jednu vrstvu – na straně Vrstva uveď násobnost "1..*".',
            wrongTargetRole: 'U kompozice Platno ◆→ Vrstva uveď na straně Vrstva roli "vrstvy".'
          }
        },
        {
          id: 'geo-rel-vrstva-tvar',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'geo-vrstva',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'geo-tvar',
          targetMultiplicity: '0..*',
          targetRole: 'tvary',
          label: 'eviduje',
          feedback: {
            wrongType: 'Tvary jsou existenčně svázány se svou vrstvou – mezi Vrstva a Tvar použij jednosměrnou kompozici (plný kosočtverec u Vrstva).',
            wrongSourceMultiplicity: 'U kompozice Vrstva ◆→ Tvar musí být na straně celku (Vrstva) násobnost "1".',
            wrongTargetRole: 'U kompozice Vrstva ◆→ Tvar uveď na straně Tvar roli "tvary".'
          }
        },
        {
          id: 'geo-rel-platno-tvar',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'geo-platno',
          sourceMultiplicity: '0..1',
          sourceRole: null,
          targetId: 'geo-tvar',
          targetMultiplicity: '0..1',
          targetRole: 'oznacenyTvar',
          label: 'označuje'
        },
        {
          id: 'geo-rel-tvar-bod',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'geo-tvar',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'geo-bod',
          targetMultiplicity: '1',
          targetRole: 'kotevniBod',
          label: 'definuje polohu',
          feedback: {
            wrongType: 'Stávající vazbu Tvar → Bod je v tomto kroku nutné zpřesnit z prosté asociace na jednosměrnou kompozici (plný kosočtverec u Tvar).',
            wrongTargetRole: 'U kompozice Tvar ◆→ Bod ponech na straně Bod roli "kotevniBod".'
          }
        },
        {
          id: 'geo-rel-tvar-styl',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'geo-tvar',
          sourceMultiplicity: '0..*',
          sourceRole: 'pouzivajiciTvary',
          targetId: 'geo-styl',
          targetMultiplicity: '0..1',
          targetRole: 'styl',
          label: 'používá'
        },
        {
          id: 'geo-rel-paleta-styl',
          type: 'aggregation',
          navigability: 'unidirectional',
          sourceId: 'geo-paleta',
          sourceMultiplicity: '0..1',
          sourceRole: null,
          targetId: 'geo-styl',
          targetMultiplicity: '0..*',
          targetRole: 'styly',
          label: 'sdružuje',
          feedback: {
            wrongType: 'Při smazání palety styly nadále existují (nezávislý životní cyklus) – mezi Paleta a Styl použij jednosměrnou agregaci (prázdný kosočtverec u Paleta).',
            wrongSourceMultiplicity: 'U agregace Paleta ◇→ Styl uveď na straně Paleta násobnost "0..1" (styl může existovat i mimo paletu).',
            wrongTargetRole: 'U agregace Paleta ◇→ Styl uveď na straně Styl roli "styly".'
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 4 (2.4): Generalizace, abstraktní třída a finální podoba diagramu
  // --------------------------------------------------------------------------
  {
    id: 'p-geo-04',
    order: 4,
    title: '2.4 Generalizace, abstraktní třída a finální podoba diagramu',
    shortTitle: '2.4 Abstraktní Tvar a podtřídy',
    storyIntro: 'Závěrečný tah štětcem! Třída Tvar se proměnila v abstraktní nadtřídu s chráněnými členy (#) a abstraktními metodami – napoj k ní konkrétní tvary Kruh a Obdelnik.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-geo-03',
    assignmentTitle: 'Geometrie 4/4: Generalizace, abstraktní třída a finální podoba diagramu',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.3</strong> a dokončete jej do finální celistvé podoby převedením třídy <code>Tvar</code> na abstraktní nadtřídu a doplněním konkrétních geometrických specializací. Všechny ostatní dosavadní třídy a vazby zachovejte beze změny a proveďte přesně tyto úpravy:</p>
      <ul>
        <li><strong>Refaktoring třídy Tvar:</strong> Změňte třídu <code>Tvar</code> na <strong>abstraktní třídu</strong> (<code>abstract</code>). Změňte viditelnost atributů <code>rotaceStupne</code> (<code>double</code>) a <code>viditelny</code> (<code>boolean</code>) ze soukromé (<code>-</code>) na chráněnou (<code>#</code>) (atribut <code>tvarId</code> zůstává soukromý <code>-</code>). Označte tři bezparametrické veřejné operace <code>+vypoctiObsah(): double</code>, <code>+vypoctiObvod(): double</code> a <code>+vykresli(): void</code> jako abstraktní (<code>{abstract}</code>). Změňte viditelnost pomocné operace <code>normalizujUhel(uhel: double): double</code> ze soukromé (<code>-</code>) na chráněnou (<code>#</code>) <em>(refaktoring třídy se automaticky projevil na tvém plátně)</em>.</li>
        <li><strong>Nová konkrétní podtřída Kruh:</strong> Přidejte třídu se soukromým atributem (<code>-</code>) <code>polomer</code> typu <code>double</code>. Přidejte pět veřejných operací (<code>+</code>): bezparametrické operace <code>vypoctiObsah</code> vracející <code>double</code>, <code>vypoctiObvod</code> vracející <code>double</code> a <code>vykresli</code> vracející <code>void</code>, dále operaci <code>zmenPolomer</code> s parametrem <code>novyPolomer</code> typu <code>double</code> vracející <code>boolean</code> a operaci <code>obsahujeBod</code> s parametrem <code>bod</code> typu <code>Bod</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová konkrétní podtřída Obdelnik:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>sirka</code> typu <code>double</code>, <code>vyska</code> typu <code>double</code> a <code>zaobleniRohu</code> typu <code>double</code>. Přidejte pět veřejných operací (<code>+</code>): bezparametrické operace <code>vypoctiObsah</code> vracející <code>double</code>, <code>vypoctiObvod</code> vracející <code>double</code>, <code>vykresli</code> vracející <code>void</code> a <code>jeCtverec</code> vracející <code>boolean</code>, a dále operaci <code>zmenRozmery</code> s parametry <code>novaSirka</code> typu <code>double</code> a <code>novaVyska</code> typu <code>double</code> vracející <code>boolean</code>. Přidejte také jednu soukromou pomocnou operaci (<code>-</code>) <code>overRozmery</code> s parametry <code>sirka</code> typu <code>double</code> a <code>vyska</code> typu <code>double</code> vracející <code>boolean</code>.</li>
        <li><strong>Nové vazby generalizace:</strong> Napojte obě nové podtřídy na abstraktní nadtřídu <code>Tvar</code> pomocí <strong>dvou vazeb generalizace</strong> (plná čára s prázdnou trojúhelníkovou šipkou směřující k <code>Tvar</code>): <code>Kruh</code> dědí z <code>Tvar</code> a <code>Obdelnik</code> dědí z <code>Tvar</code>.</li>
      </ul>
    `,
    requirements: [
      'Zachovejte všech 6 dosavadních tříd (včetně aktualizované abstraktní třídy <code>Tvar</code>) a všech 6 vazeb z kroku 2.3.',
      'Přidejte z palety konkrétní podtřídy <strong>Kruh</strong> a <strong>Obdelnik</strong>.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>Kruh</code> (potomek) k <code>Tvar</code> (rodič) bez násobností.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>Obdelnik</code> (potomek) k <code>Tvar</code> (rodič) bez násobností.'
    ],
    hints: [
      'Prázdný trojúhelník u obou generalizací musí směřovat od konkrétních podtříd (Kruh, Obdelnik) k abstraktní nadtřídě Tvar, bez násobností a popisků.'
    ],
    classes: [
      GEO_CLASS_PLATNO_FULL,
      GEO_CLASS_VRSTVA,
      GEO_CLASS_TVAR_ABSTRACT,
      GEO_CLASS_KRUH,
      GEO_CLASS_OBDELNIK,
      GEO_CLASS_BOD,
      GEO_CLASS_STYL,
      GEO_CLASS_PALETA
    ],
    validationRules: {
      counts: { classifiers: 8, relations: 8 },
      expectedClasses: [
        'geo-platno',
        'geo-vrstva',
        'geo-tvar',
        'geo-kruh',
        'geo-obdelnik',
        'geo-bod',
        'geo-styl',
        'geo-paleta'
      ],
      expectedRelations: [
        {
          id: 'geo-rel-platno-vrstva',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'geo-platno',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'geo-vrstva',
          targetMultiplicity: '1..*',
          targetRole: 'vrstvy',
          label: 'obsahuje'
        },
        {
          id: 'geo-rel-vrstva-tvar',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'geo-vrstva',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'geo-tvar',
          targetMultiplicity: '0..*',
          targetRole: 'tvary',
          label: 'eviduje'
        },
        {
          id: 'geo-rel-platno-tvar',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'geo-platno',
          sourceMultiplicity: '0..1',
          sourceRole: null,
          targetId: 'geo-tvar',
          targetMultiplicity: '0..1',
          targetRole: 'oznacenyTvar',
          label: 'označuje'
        },
        {
          id: 'geo-rel-gen-kruh',
          type: 'generalization',
          sourceId: 'geo-kruh',
          targetId: 'geo-tvar',
          feedback: {
            wrongType: 'Dědičnost mezi Kruh a abstraktní třídou Tvar vyjádři generalizací (plná čára s prázdným trojúhelníkem).',
            wrongDirection: 'Šipka generalizace musí směřovat od podtřídy (Kruh) k abstraktní nadtřídě (Tvar).'
          }
        },
        {
          id: 'geo-rel-gen-obdelnik',
          type: 'generalization',
          sourceId: 'geo-obdelnik',
          targetId: 'geo-tvar',
          feedback: {
            wrongType: 'Dědičnost mezi Obdelnik a abstraktní třídou Tvar vyjádři generalizací (plná čára s prázdným trojúhelníkem).',
            wrongDirection: 'Šipka generalizace musí směřovat od podtřídy (Obdelnik) k abstraktní nadtřídě (Tvar).'
          }
        },
        {
          id: 'geo-rel-tvar-bod',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'geo-tvar',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'geo-bod',
          targetMultiplicity: '1',
          targetRole: 'kotevniBod',
          label: 'definuje polohu'
        },
        {
          id: 'geo-rel-tvar-styl',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'geo-tvar',
          sourceMultiplicity: '0..*',
          sourceRole: 'pouzivajiciTvary',
          targetId: 'geo-styl',
          targetMultiplicity: '0..1',
          targetRole: 'styl',
          label: 'používá'
        },
        {
          id: 'geo-rel-paleta-styl',
          type: 'aggregation',
          navigability: 'unidirectional',
          sourceId: 'geo-paleta',
          sourceMultiplicity: '0..1',
          sourceRole: null,
          targetId: 'geo-styl',
          targetMultiplicity: '0..*',
          targetRole: 'styly',
          label: 'sdružuje'
        }
      ]
    }
  }
];

export const GEOMETRIE_CHAPTER = {
  id: 'ch-geometrie',
  type: 'practice',
  order: 4,
  title: 'Praxe 3: Geometrie (Malování)',
  subtitle: 'Vektorové plátno, vrstvy, styly a hierarchie tvarů',
  badge: 'Mistr vektorového plátna',
  subchapters: RAW_GEOMETRIE_SUBCHAPTERS.map((sub) => normalizePracticeSubchapter('ch-geometrie', sub))
};

export const PRACTICE_CHAPTERS = [
  AUTOSERVIS_CHAPTER,
  BANKA_CHAPTER,
  GEOMETRIE_CHAPTER
];