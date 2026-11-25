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
    { visibility: '-', name: 'email', type: 'String', isStatic: false },
    { visibility: '-', name: 'vozidla', type: 'List<Vozidlo>', isStatic: false }
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
    { visibility: '-', name: 'poznamka', type: 'String', isStatic: false },
    { visibility: '-', name: 'pridelenyMechanik', type: 'Mechanik', isStatic: false },
    { visibility: '-', name: 'opravovaneVozidlo', type: 'Vozidlo', isStatic: false }
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
    { visibility: '-', name: 'poznamka', type: 'String', isStatic: false },
    { visibility: '-', name: 'pridelenyMechanik', type: 'Mechanik', isStatic: false },
    { visibility: '-', name: 'opravovaneVozidlo', type: 'Vozidlo', isStatic: false },
    { visibility: '-', name: 'polozky', type: 'List<PolozkaZakazky>', isStatic: false }
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
    { visibility: '-', name: 'hodinovaSazba', type: 'BigDecimal', isStatic: false },
    { visibility: '-', name: 'mechanici', type: 'List<Mechanik>', isStatic: false },
    { visibility: '-', name: 'zakazky', type: 'List<ServisniZakazka>', isStatic: false }
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
  // Krok 1 (2.1): Základní třídy, zapouzdření a řiditelná asociace s multiplicitami
  // --------------------------------------------------------------------------
  {
    id: 'p-auto-01',
    order: 1,
    title: '2.1 Základní třídy, zapouzdření a řiditelná asociace s multiplicitami',
    shortTitle: '2.1 Zákazník a Vozidlo',
    storyIntro: 'Vítej v dílně Autoservisu! Začneme pevným základem celého systému: propojíme zákazníka s jeho vozidly pomocí jednosměrné řiditelné asociace a cílové role.',
    inheritPreviousCanvas: false,
    previousSubchapterId: null,
    assignmentTitle: 'Autoservis 1/4: Základní třídy, zapouzdření a řiditelná asociace s multiplicitami',
    assignmentHtml: `
      <p>Vytvořte výchozí návrhový diagram tříd (UML 2.5) pro doménu <strong>Autoservis</strong> určený pro implementaci v jazyce Java. Diagram v tomto prvním kroku obsahuje <strong>přesně dvě konkrétní třídy propojené jednou jednosměrnou řiditelnou asociací</strong>. Každá řiditelná vazba je ve zdrojové třídě realizována soukromým referenčním atributem, na který ukazuje cílová role; nemodelujte konstruktory ani žádné nespecifikované atributy či metody.</p>
      <p>Vytvořte konkrétní třídu <strong>Zakaznik</strong> se všemi atributy soukromými (<code>-</code>): <code>zakaznikId</code> typu <code>String</code>, <code>jmeno</code> typu <code>String</code>, <code>prijmeni</code> typu <code>String</code>, <code>telefon</code> typu <code>String</code>, <code>email</code> typu <code>String</code> a referenčním atributem <code>vozidla</code> typu <code>List&lt;Vozidlo&gt;</code>. Třída poskytuje čtyři veřejné operace (<code>+</code>): <code>pridejVozidlo</code> s parametrem <code>vozidlo</code> typu <code>Vozidlo</code> vracející <code>void</code>, <code>odeberVozidlo</code> s parametrem <code>vin</code> typu <code>String</code> vracející <code>boolean</code>, <code>aktualizujTelefon</code> s parametrem <code>novyTelefon</code> typu <code>String</code> vracející <code>boolean</code> a bezparametrickou operaci <code>ziskejPocetVozidel</code> vracející <code>int</code>.</p>
      <p>Vytvořte konkrétní třídu <strong>Vozidlo</strong> (v tomto kroku zatím jako běžnou konkrétní třídu, nikoli abstraktní) se všemi atributy soukromými (<code>-</code>): <code>vin</code> typu <code>String</code>, <code>spz</code> typu <code>String</code>, <code>znacka</code> typu <code>String</code>, <code>rokVyroby</code> typu <code>int</code>, <code>najeteKm</code> typu <code>int</code> a <code>technickyZpusobile</code> typu <code>boolean</code>. Třída poskytuje pět veřejných operací (<code>+</code>): bezparametrické operace <code>vypoctiZakladniSazbu</code> vracející <code>BigDecimal</code>, <code>ziskejTypVozidla</code> vracející <code>String</code> a <code>ziskejVin</code> vracející <code>String</code>, dále operaci <code>aktualizujNajezd</code> s parametrem <code>noveKm</code> typu <code>int</code> vracející <code>boolean</code> a operaci <code>nastavTechnickouZpusobilost</code> s parametrem <code>zpusobile</code> typu <code>boolean</code> vracející <code>void</code>. Dále obsahuje jednu soukromou pomocnou operaci (<code>-</code>) <code>overNajezd</code> s parametrem <code>noveKm</code> typu <code>int</code> vracející <code>boolean</code>.</p>
      <p>Třídy <strong>Zakaznik</strong> a <strong>Vozidlo</strong> propojte <strong>jednosměrnou řiditelnou asociací</strong> směřující ze <code>Zakaznik</code> na <code>Vozidlo</code> (otevřená šipka u <code>Vozidlo</code>). Každé vozidlo patří vždy právě jednomu zákazníkovi (multiplicita <code>1</code> na straně <code>Zakaznik</code>) a každý zákazník musí vlastnit alespoň jedno vozidlo (multiplicita <code>1..*</code> a role <code>vozidla</code> na straně <code>Vozidlo</code>, odpovídající referenčnímu atributu <code>-vozidla: List&lt;Vozidlo&gt;</code> ve třídě <code>Zakaznik</code>).</p>
    `,
    requirements: [
      'Umístěte na plátno konkrétní třídy <strong>Zakaznik</strong> (včetně referenčního atributu <code>-vozidla: List&lt;Vozidlo&gt;</code>) a <strong>Vozidlo</strong>.',
      'Propojte je <strong>jednosměrnou řiditelnou asociací</strong> směřující ze <code>Zakaznik</code> na <code>Vozidlo</code> (otevřená šipka u <code>Vozidlo</code>).',
      'Nastavte multiplicitu <code>1</code> na straně <code>Zakaznik</code> a multiplicitu <code>1..*</code> s rolí <code>vozidla</code> na straně <code>Vozidlo</code>.'
    ],
    hints: [
      'Cílová role vozidla ukazuje přímo na soukromý referenční atribut -vozidla: List<Vozidlo> ve třídě Zakaznik. Nechte si kolem obou tříd dostatek místa pro další kroky.'
    ],
    classes: [AUTO_CLASS_ZAKAZNIK, AUTO_CLASS_VOZIDLO_CONCRETE],
    validationRules: {
      counts: { classifiers: 2, relations: 1 },
      expectedClasses: ['auto-zakaznik', 'auto-vozidlo'],
      expectedRelations: [
        {
          id: 'auto-rel-zakaznik-vozidlo',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'auto-zakaznik',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'auto-vozidlo',
          targetMultiplicity: '1..*',
          targetRole: 'vozidla',
          feedback: {
            wrongType: 'Mezi třídami Zakaznik a Vozidlo použij jednosměrnou řiditelnou asociaci (otevřená šipka u Vozidlo), nikoli obousměrnou asociaci (<-->).',
            wrongDirection: 'Šipka řiditelnosti musí směřovat od Zakaznik (který drží referenční atribut vozidla) k Vozidlo.',
            wrongSourceMultiplicity: 'U vazby Zakaznik → Vozidlo nastav na straně Zakaznik multiplicitu „1“ (každé vozidlo patří právě jednomu zákazníkovi).',
            wrongTargetMultiplicity: 'U vazby Zakaznik → Vozidlo nastav na straně Vozidlo multiplicitu „1..*“ (každý zákazník vlastní alespoň jedno vozidlo).',
            wrongTargetRole: 'U vazby Zakaznik → Vozidlo doplň na straně Vozidlo roli „vozidla“ odpovídající referenčnímu atributu -vozidla: List<Vozidlo> ve třídě Zakaznik.'
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 2 (2.2): Řiditelnost asociací, role a referenční atributy
  // --------------------------------------------------------------------------
  {
    id: 'p-auto-02',
    order: 2,
    title: '2.2 Řiditelnost asociací, role a referenční atributy',
    shortTitle: '2.2 Zakázka a Mechanik',
    storyIntro: 'Výborně, základ stojí. Teď na tvé plátno přivedeme servisní zakázky a mechaniky – zachovej stávající vazbu a veď jednosměrné řiditelné asociace od zakázky.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-auto-01',
    assignmentTitle: 'Autoservis 2/4: Řiditelnost asociací, role a referenční atributy',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.1</strong> a rozšiřte jej o servisní zakázky, mechaniky a jednosměrně řiditelné asociace s rolemi navázanými na referenční atributy. Všechny stávající třídy, atributy, metody i vazbu <code>Zakaznik → Vozidlo</code> z předchozího kroku zachovejte beze změny a proveďte přesně následující doplnění:</p>
      <ul>
        <li><strong>Nová konkrétní třída Mechanik:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>mechanikId</code> typu <code>String</code>, <code>jmeno</code> typu <code>String</code>, <code>prijmeni</code> typu <code>String</code>, <code>specializace</code> typu <code>String</code> a <code>dostupny</code> typu <code>boolean</code>. Přidejte tři veřejné operace (<code>+</code>): <code>nastavDostupnost</code> s parametrem <code>dostupny</code> typu <code>boolean</code> vracející <code>void</code>, <code>zmenSpecializaci</code> s parametrem <code>novaSpecializace</code> typu <code>String</code> vracející <code>void</code> a bezparametrickou operaci <code>jeDostupny</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová konkrétní třída ServisniZakazka</strong> (základní rozsah před zavedením položek zakázky): Přidejte třídu se soukromými atributy (<code>-</code>): <code>cisloZakazky</code> typu <code>String</code>, <code>datumPrijeti</code> typu <code>LocalDateTime</code>, <code>planovaneDokonceni</code> typu <code>LocalDate</code>, <code>stav</code> typu <code>String</code>, <code>poznamka</code> typu <code>String</code> a dvěma soukromými referenčními atributy <code>pridelenyMechanik</code> typu <code>Mechanik</code> a <code>opravovaneVozidlo</code> typu <code>Vozidlo</code>. Přidejte tři veřejné operace (<code>+</code>): <code>priradMechanika</code> s parametrem <code>mechanik</code> typu <code>Mechanik</code> vracející <code>void</code>, bezparametrickou operaci <code>vypoctiCelkovouCenu</code> vracející <code>BigDecimal</code> a bezparametrickou operaci <code>uzavriZakazku</code> vracející <code>boolean</code>. Dále přidejte jednu soukromou pomocnou operaci (<code>-</code>) <code>vypoctiDph</code> s parametrem <code>zakladDane</code> typu <code>BigDecimal</code> vracející <code>BigDecimal</code>.</li>
        <li><strong>Nová vazba ServisniZakazka → Mechanik:</strong> Vytvořte jednosměrnou řiditelnou asociaci směřující ze <code>ServisniZakazka</code> na <code>Mechanik</code> (otevřená šipka u <code>Mechanik</code>). Na straně <code>ServisniZakazka</code> uveďte multiplicitu <code>0..*</code>, na straně <code>Mechanik</code> uveďte multiplicitu <code>0..1</code> a roli <code>pridelenyMechanik</code> (odpovídající referenčnímu atributu <code>-pridelenyMechanik: Mechanik</code>).</li>
        <li><strong>Nová vazba ServisniZakazka → Vozidlo:</strong> Vytvořte jednosměrnou řiditelnou asociaci směřující ze <code>ServisniZakazka</code> na <code>Vozidlo</code> (otevřená šipka u <code>Vozidlo</code>). Na straně <code>ServisniZakazka</code> uveďte multiplicitu <code>0..*</code>, na straně <code>Vozidlo</code> uveďte multiplicitu <code>1</code> a roli <code>opravovaneVozidlo</code> (odpovídající referenčnímu atributu <code>-opravovaneVozidlo: Vozidlo</code>).</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající třídy <code>Zakaznik</code>, <code>Vozidlo</code> i jejich jednosměrnou řiditelnou asociaci <code>Zakaznik (1)</code> → <code>Vozidlo (1..*, role: vozidla)</code>.',
      'Přidejte na plátno nové třídy <strong>Mechanik</strong> a <strong>ServisniZakazka</strong> (s referenčními atributy <code>-pridelenyMechanik: Mechanik</code> a <code>-opravovaneVozidlo: Vozidlo</code>).',
      'Vytvořte jednosměrnou řiditelnou asociaci <code>ServisniZakazka (0..*)</code> → <code>Mechanik (0..1, role: pridelenyMechanik)</code>.',
      'Vytvořte jednosměrnou řiditelnou asociaci <code>ServisniZakazka (0..*)</code> → <code>Vozidlo (1, role: opravovaneVozidlo)</code>.'
    ],
    hints: [
      'U obou nových vazeb vycházejících ze ServisniZakazka odpovídá cílová role přesně názvu referenčního atributu ve třídě ServisniZakazka (pridelenyMechanik a opravovaneVozidlo).'
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
          feedback: {
            wrongTargetMultiplicity: 'U vazby ServisniZakazka → Mechanik nastav na straně Mechanik multiplicitu „0..1“ (zakázka nemusí mít mechanika přiděleného ihned).',
            wrongTargetRole: 'U vazby ServisniZakazka → Mechanik doplň na straně Mechanik roli „pridelenyMechanik“ odpovídající referenčnímu atributu ve třídě ServisniZakazka.'
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
          feedback: {
            wrongTargetMultiplicity: 'U vazby ServisniZakazka → Vozidlo nastav na straně Vozidlo multiplicitu „1“ (každá zakázka opravuje právě jedno vozidlo).',
            wrongTargetRole: 'U vazby ServisniZakazka → Vozidlo doplň na straně Vozidlo roli „opravovaneVozidlo“ odpovídající referenčnímu atributu ve třídě ServisniZakazka.'
          }
        },
        {
          id: 'auto-rel-zakaznik-vozidlo',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'auto-zakaznik',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'auto-vozidlo',
          targetMultiplicity: '1..*',
          targetRole: 'vozidla'
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
    storyIntro: 'Třída ServisniZakazka byla automaticky rozšířena o referenční atribut polozky a metody pro správu položek. Nyní doplň zastřešující provozovnu Autoservis, třídu PolozkaZakazky a správně rozliš agregaci od kompozice.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-auto-02',
    assignmentTitle: 'Autoservis 3/4: Vazby celek–část (agregace a kompozice)',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.2</strong> a doplňte ústřední provozovnu autoservisu, fakturované položky zakázek a vazby typu celek–část (agregace a kompozice). Všechny dosavadní prvky z předchozího kroku zachovejte a proveďte přesně následující změny (cílová role každé vazby ukazuje na odpovídající referenční atribut ve zdrojové třídě):</p>
      <ul>
        <li><strong>Úprava stávající třídy ServisniZakazka:</strong> Doplňte soukromý referenční atribut (<code>-</code>) <code>polozky</code> typu <code>List&lt;PolozkaZakazky&gt;</code> a dvě veřejné operace (<code>+</code>) pro správu položek: <code>pridejPolozku</code> s parametrem <code>polozka</code> typu <code>PolozkaZakazky</code> vracející <code>void</code> a <code>odeberPolozku</code> s parametrem <code>polozkaId</code> typu <code>String</code> vracející <code>boolean</code> <em>(aktualizace se automaticky promítla na kartě třídy na plátně)</em>.</li>
        <li><strong>Nová konkrétní třída Autoservis:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>nazev</code> typu <code>String</code>, <code>ico</code> typu <code>String</code>, <code>adresa</code> typu <code>String</code>, <code>hodinovaSazba</code> typu <code>BigDecimal</code> a dvěma soukromými referenčními atributy <code>mechanici</code> typu <code>List&lt;Mechanik&gt;</code> a <code>zakazky</code> typu <code>List&lt;ServisniZakazka&gt;</code>. Přidejte pět veřejných operací (<code>+</code>): <code>pridejMechanika</code> s parametrem <code>mechanik</code> typu <code>Mechanik</code> vracející <code>void</code>, <code>odeberMechanika</code> s parametrem <code>mechanikId</code> typu <code>String</code> vracející <code>boolean</code>, <code>zalozZakazku</code> s parametrem <code>zakazka</code> typu <code>ServisniZakazka</code> vracející <code>void</code>, <code>najdiZakazku</code> s parametrem <code>cisloZakazky</code> typu <code>String</code> vracející <code>ServisniZakazka</code> a bezparametrickou operaci <code>ziskejPocetOtevrenychZakazek</code> vracející <code>int</code>.</li>
        <li><strong>Nová konkrétní třída PolozkaZakazky:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>polozkaId</code> typu <code>String</code>, <code>popis</code> typu <code>String</code>, <code>mnozstvi</code> typu <code>double</code>, <code>jednotkovaCena</code> typu <code>BigDecimal</code> a <code>jeNahradniDil</code> typu <code>boolean</code>. Přidejte tři veřejné operace (<code>+</code>): bezparametrickou operaci <code>vypoctiMezisoucet</code> vracející <code>BigDecimal</code>, operaci <code>upravMnozstvi</code> s parametrem <code>noveMnozstvi</code> typu <code>double</code> vracející <code>boolean</code> a operaci <code>zmenJednotkovouCenu</code> s parametrem <code>novaCena</code> typu <code>BigDecimal</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová agregace Autoservis ◇→ Mechanik:</strong> Autoservis sdružuje mechaniky s nezávislým životním cyklem (při zrušení autoservisu záznamy mechaniků v systému nadále existují). Vytvořte <strong>jednosměrnou řiditelnou agregaci</strong> z celku <code>Autoservis</code> (prázdný kosočtverec u <code>Autoservis</code>) k části <code>Mechanik</code> (šipka u <code>Mechanik</code>). Na straně <code>Autoservis</code> uveďte multiplicitu <code>0..1</code>, na straně <code>Mechanik</code> uveďte multiplicitu <code>0..*</code> a roli <code>mechanici</code> (odpovídající atributu <code>-mechanici: List&lt;Mechanik&gt;</code>).</li>
        <li><strong>Nová kompozice Autoservis ◆→ ServisniZakazka:</strong> Servisní zakázky jsou existenčně závislou součástí autoservisu a při jeho zrušení zanikají. Vytvořte <strong>jednosměrnou řiditelnou kompozici</strong> z celku <code>Autoservis</code> (plný kosočtverec u <code>Autoservis</code>) k části <code>ServisniZakazka</code> (šipka u <code>ServisniZakazka</code>). Na straně <code>Autoservis</code> uveďte multiplicitu <code>1</code>, na straně <code>ServisniZakazka</code> uveďte multiplicitu <code>0..*</code> a roli <code>zakazky</code> (odpovídající atributu <code>-zakazky: List&lt;ServisniZakazka&gt;</code>).</li>
        <li><strong>Nová kompozice ServisniZakazka ◆→ PolozkaZakazky:</strong> Položky zakázky jsou existenčně vázány na konkrétní zakázku a při jejím odstranění zanikají. Vytvořte <strong>jednosměrnou řiditelnou kompozici</strong> z celku <code>ServisniZakazka</code> (plný kosočtverec u <code>ServisniZakazka</code>) k části <code>PolozkaZakazky</code> (šipka u <code>PolozkaZakazky</code>). Na straně <code>ServisniZakazka</code> uveďte multiplicitu <code>1</code>, na straně <code>PolozkaZakazky</code> uveďte multiplicitu <code>1..*</code> a roli <code>polozky</code> (odpovídající atributu <code>-polozky: List&lt;PolozkaZakazky&gt;</code>).</li>
      </ul>
    `,
    requirements: [
      'Zachovejte všechny 4 stávající třídy a 3 vazby z předchozího kroku.',
      'Přidejte z palety nové třídy <strong>Autoservis</strong> (s referenčními atributy <code>-mechanici: List&lt;Mechanik&gt;</code> a <code>-zakazky: List&lt;ServisniZakazka&gt;</code>) a <strong>PolozkaZakazky</strong>.',
      'Vytvořte jednosměrnou řiditelnou <strong>agregaci</strong> <code>Autoservis (0..1)</code> ◇→ <code>Mechanik (0..*, role: mechanici)</code>.',
      'Vytvořte jednosměrnou řiditelnou <strong>kompozici</strong> <code>Autoservis (1)</code> ◆→ <code>ServisniZakazka (0..*, role: zakazky)</code>.',
      'Vytvořte jednosměrnou řiditelnou <strong>kompozici</strong> <code>ServisniZakazka (1)</code> ◆→ <code>PolozkaZakazky (1..*, role: polozky)</code>.'
    ],
    hints: [
      'Autoservis → Mechanik je slabá agregace (prázdný kosočtverec, 0..1), zatímco Autoservis → ServisniZakazka i ServisniZakazka → PolozkaZakazky jsou silné kompozice (plný kosočtverec, 1). Cílové role mechanici, zakazky a polozky odpovídají referenčním atributům typu List<...>.'
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
          feedback: {
            wrongType: 'Mechanici mají nezávislý životní cyklus (při zrušení autoservisu nezanikají) – mezi Autoservis a Mechanik použij jednosměrnou řiditelnou agregaci (prázdný kosočtverec).',
            wrongSourceMultiplicity: 'U agregace Autoservis ◇→ Mechanik uveď na straně Autoservis multiplicitu „0..1“.',
            wrongTargetRole: 'U agregace Autoservis ◇→ Mechanik uveď na straně Mechanik roli „mechanici“ odpovídající referenčnímu atributu -mechanici: List<Mechanik>.'
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
          feedback: {
            wrongType: 'Servisní zakázky jsou existenčně závislé na autoservisu – mezi Autoservis a ServisniZakazka použij jednosměrnou řiditelnou kompozici (plný kosočtverec).',
            wrongSourceMultiplicity: 'U kompozice Autoservis ◆→ ServisniZakazka musí být na straně celku (Autoservis) multiplicita „1“.',
            wrongTargetRole: 'U kompozice Autoservis ◆→ ServisniZakazka uveď na straně ServisniZakazka roli „zakazky“ odpovídající referenčnímu atributu -zakazky: List<ServisniZakazka>.'
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
          feedback: {
            wrongType: 'Položky zakázky zanikají spolu se zakázkou – mezi ServisniZakazka a PolozkaZakazky použij jednosměrnou řiditelnou kompozici (plný kosočtverec).',
            wrongSourceMultiplicity: 'U kompozice ServisniZakazka ◆→ PolozkaZakazky musí být na straně celku (ServisniZakazka) multiplicita „1“.',
            wrongTargetMultiplicity: 'Každá servisní zakázka musí obsahovat alespoň jednu položku – na straně PolozkaZakazky uveď multiplicitu „1..*“.',
            wrongTargetRole: 'U kompozice ServisniZakazka ◆→ PolozkaZakazky uveď na straně PolozkaZakazky roli „polozky“ odpovídající referenčnímu atributu -polozky: List<PolozkaZakazky>.'
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
          targetRole: 'pridelenyMechanik'
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
          targetRole: 'opravovaneVozidlo'
        },
        {
          id: 'auto-rel-zakaznik-vozidlo',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'auto-zakaznik',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'auto-vozidlo',
          targetMultiplicity: '1..*',
          targetRole: 'vozidla'
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
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.3</strong> a dokončete jej do finální celistvé podoby převedením třídy <code>Vozidlo</code> na abstraktní nadtřídu a doplněním konkrétních specializací vozidel. Všechny ostatní dosavadní třídy, referenční atributy a vazby zachovejte beze změny a proveďte přesně tyto úpravy:</p>
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
      'Vytvořte vazbu <strong>generalizace</strong> od <code>OsobniAuto</code> (potomek) k <code>Vozidlo</code> (rodič) bez multiplicit a rolí.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>Dodavka</code> (potomek) k <code>Vozidlo</code> (rodič) bez multiplicit a rolí.'
    ],
    hints: [
      'U obou generalizací musí prázdný trojúhelník ukazovat na abstraktní nadtřídu Vozidlo (zdroj = OsobniAuto / Dodavka, cíl = Vozidlo) bez multiplicit a rolí.'
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
          targetRole: 'mechanici'
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
          targetRole: 'zakazky'
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
          targetRole: 'polozky'
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
          targetRole: 'pridelenyMechanik'
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
          targetRole: 'opravovaneVozidlo'
        },
        {
          id: 'auto-rel-zakaznik-vozidlo',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'auto-zakaznik',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'auto-vozidlo',
          targetMultiplicity: '1..*',
          targetRole: 'vozidla'
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
    { visibility: '-', name: 'email', type: 'String', isStatic: false },
    { visibility: '-', name: 'ucty', type: 'List<BankovniUcet>', isStatic: false }
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
    { visibility: '-', name: 'aktivni', type: 'boolean', isStatic: false },
    { visibility: '-', name: 'transakce', type: 'List<Transakce>', isStatic: false }
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
    { visibility: '#', name: 'aktivni', type: 'boolean', isStatic: false },
    { visibility: '-', name: 'transakce', type: 'List<Transakce>', isStatic: false }
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
    { visibility: '-', name: 'casProvedeni', type: 'LocalDateTime', isStatic: false },
    { visibility: '-', name: 'pouzitaKarta', type: 'PlatebniKarta', isStatic: false }
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
    { visibility: '-', name: 'swiftKod', type: 'String', isStatic: false },
    { visibility: '-', name: 'pobocky', type: 'List<Pobocka>', isStatic: false }
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
    { visibility: '-', name: 'mesto', type: 'String', isStatic: false },
    { visibility: '-', name: 'kmenoviKlienti', type: 'List<Klient>', isStatic: false }
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
    { visibility: '-', name: 'mesicniPoplatek', type: 'BigDecimal', isStatic: false },
    { visibility: '-', name: 'platebniKarta', type: 'PlatebniKarta', isStatic: false }
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
  // Krok 1 (2.1): Základní třídy, zapouzdření a řiditelná asociace s multiplicitami
  // --------------------------------------------------------------------------
  {
    id: 'p-banka-01',
    order: 1,
    title: '2.1 Základní třídy, zapouzdření a řiditelná asociace s multiplicitami',
    shortTitle: '2.1 Klient a Účet',
    storyIntro: 'Vstupuješ do bankovního domu! Nejdříve postavíme základní stavební kámen finančního systému: jednosměrnou řiditelnou asociaci mezi klientem a jeho bankovními účty.',
    inheritPreviousCanvas: false,
    previousSubchapterId: null,
    assignmentTitle: 'Banka 1/4: Základní třídy, zapouzdření a řiditelná asociace s multiplicitami',
    assignmentHtml: `
      <p>Vytvořte výchozí návrhový diagram tříd (UML 2.5) pro doménu <strong>Banka</strong> určený pro implementaci v jazyce Java. Diagram v tomto prvním kroku obsahuje <strong>přesně dvě konkrétní třídy propojené jednou jednosměrnou řiditelnou asociací</strong>. Každá řiditelná vazba je ve zdrojové třídě realizována soukromým referenčním atributem, na který ukazuje cílová role; nemodelujte konstruktory ani žádné nespecifikované atributy či metody.</p>
      <p>Vytvořte konkrétní třídu <strong>Klient</strong> se všemi atributy soukromými (<code>-</code>): <code>klientId</code> typu <code>String</code>, <code>jmeno</code> typu <code>String</code>, <code>prijmeni</code> typu <code>String</code>, <code>datumNarozeni</code> typu <code>LocalDate</code>, <code>email</code> typu <code>String</code> a referenčním atributem <code>ucty</code> typu <code>List&lt;BankovniUcet&gt;</code>. Třída poskytuje tři veřejné operace (<code>+</code>): <code>pridejUcet</code> s parametrem <code>ucet</code> typu <code>BankovniUcet</code> vracející <code>void</code>, bezparametrickou operaci <code>ziskejCelkovyZustatek</code> vracející <code>BigDecimal</code> a operaci <code>aktualizujEmail</code> s parametrem <code>novyEmail</code> typu <code>String</code> vracející <code>boolean</code>.</p>
      <p>Vytvořte konkrétní třídu <strong>BankovniUcet</strong> (v tomto kroku zatím jako běžnou konkrétní třídu, nikoli abstraktní) se všemi atributy soukromými (<code>-</code>): <code>cisloUctu</code> typu <code>String</code>, <code>zustatek</code> typu <code>BigDecimal</code>, <code>datumZalozeni</code> typu <code>LocalDate</code> a <code>aktivni</code> typu <code>boolean</code>. Třída poskytuje čtyři veřejné operace (<code>+</code>): <code>vloz</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>, <code>vyber</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>, bezparametrickou operaci <code>ziskejZustatek</code> vracející <code>BigDecimal</code> a bezparametrickou operaci <code>zablokujUcet</code> vracející <code>void</code>.</p>
      <p>Třídy <strong>Klient</strong> a <strong>BankovniUcet</strong> propojte <strong>jednosměrnou řiditelnou asociací</strong> směřující z <code>Klient</code> na <code>BankovniUcet</code> (otevřená šipka u <code>BankovniUcet</code>). Každý bankovní účet patří vždy právě jednomu klientovi (multiplicita <code>1</code> na straně <code>Klient</code>) a každý klient musí vlastnit alespoň jeden bankovní účet (multiplicita <code>1..*</code> a role <code>ucty</code> na straně <code>BankovniUcet</code>, odpovídající referenčnímu atributu <code>-ucty: List&lt;BankovniUcet&gt;</code> ve třídě <code>Klient</code>).</p>
    `,
    requirements: [
      'Umístěte na plátno konkrétní třídy <strong>Klient</strong> (včetně referenčního atributu <code>-ucty: List&lt;BankovniUcet&gt;</code>) a <strong>BankovniUcet</strong>.',
      'Propojte je <strong>jednosměrnou řiditelnou asociací</strong> směřující z <code>Klient</code> na <code>BankovniUcet</code> (otevřená šipka u <code>BankovniUcet</code>).',
      'Nastavte multiplicitu <code>1</code> na straně <code>Klient</code> a multiplicitu <code>1..*</code> s rolí <code>ucty</code> na straně <code>BankovniUcet</code>.'
    ],
    hints: [
      'Cílová role ucty ukazuje na soukromý referenční atribut -ucty: List<BankovniUcet> ve třídě Klient. Rozmístěte třídy s dostatečným odstupem pro další kroky.'
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
          navigability: 'unidirectional',
          sourceId: 'banka-klient',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'banka-ucet',
          targetMultiplicity: '1..*',
          targetRole: 'ucty',
          feedback: {
            wrongType: 'Mezi třídami Klient a BankovniUcet použij jednosměrnou řiditelnou asociaci (otevřená šipka u BankovniUcet), nikoli obousměrnou asociaci (<-->).',
            wrongDirection: 'Šipka řiditelnosti musí směřovat od Klient (který drží referenční atribut ucty) k BankovniUcet.',
            wrongSourceMultiplicity: 'U vazby Klient → BankovniUcet nastav na straně Klient multiplicitu „1“ (každý bankovní účet patří právě jednomu klientovi).',
            wrongTargetMultiplicity: 'U vazby Klient → BankovniUcet zkontroluj multiplicitu na straně účtu (každý klient musí vlastnit alespoň jeden bankovní účet: 1..*).',
            wrongTargetRole: 'U vazby Klient → BankovniUcet doplň na straně BankovniUcet roli „ucty“ odpovídající referenčnímu atributu -ucty: List<BankovniUcet> ve třídě Klient.'
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 2 (2.2): Řiditelnost asociací, role a referenční atributy
  // --------------------------------------------------------------------------
  {
    id: 'p-banka-02',
    order: 2,
    title: '2.2 Řiditelnost asociací, role a referenční atributy',
    shortTitle: '2.2 Transakce a Karta',
    storyIntro: 'Na plátno se přenesly tvé třídy z minulého kroku a BankovniUcet získal referenční atribut transakce i soukromou operaci pridejTransakci. Zapoj evidenci transakcí a platebních karet.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-banka-01',
    assignmentTitle: 'Banka 2/4: Řiditelnost asociací, role a referenční atributy',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.1</strong> a rozšiřte jej o evidenci transakcí, platebních karet a jednosměrně řiditelné asociace s rolemi navázanými na referenční atributy. Stávající třídy i vazbu <code>Klient → BankovniUcet</code> zachovejte a proveďte přesně následující úpravy a doplnění:</p>
      <ul>
        <li><strong>Úprava stávající třídy BankovniUcet:</strong> Doplňte soukromý referenční atribut (<code>-</code>) <code>transakce</code> typu <code>List&lt;Transakce&gt;</code> a soukromou operaci (<code>-</code>) <code>pridejTransakci</code> s parametrem <code>transakce</code> typu <code>Transakce</code> a návratovým typem <code>void</code> <em>(aktualizace se automaticky promítla na kartě třídy na plátně)</em>.</li>
        <li><strong>Nová konkrétní třída Transakce:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>transakceId</code> typu <code>String</code>, <code>castka</code> typu <code>BigDecimal</code>, <code>typTransakce</code> typu <code>String</code>, <code>casProvedeni</code> typu <code>LocalDateTime</code> a referenčním atributem <code>pouzitaKarta</code> typu <code>PlatebniKarta</code>. Přidejte tři veřejné bezparametrické operace (<code>+</code>): <code>ziskejCastku</code> vracející <code>BigDecimal</code>, <code>ziskejCasProvedeni</code> vracející <code>LocalDateTime</code> a <code>jeKaretniTransakce</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová konkrétní třída PlatebniKarta:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>cisloKarty</code> typu <code>String</code>, <code>pinHash</code> typu <code>String</code>, <code>datumExpirace</code> typu <code>LocalDate</code>, <code>denniLimit</code> typu <code>BigDecimal</code> a <code>zablokovana</code> typu <code>boolean</code>. Přidejte čtyři veřejné operace (<code>+</code>): <code>overPin</code> s parametrem <code>zadanyPin</code> typu <code>String</code> vracející <code>boolean</code>, <code>zmenDenniLimit</code> s parametrem <code>novyLimit</code> typu <code>BigDecimal</code> vracející <code>boolean</code>, bezparametrickou operaci <code>zablokujKartu</code> vracející <code>void</code> a operaci <code>jePlatna</code> s parametrem <code>aktualniDatum</code> typu <code>LocalDate</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová vazba BankovniUcet → Transakce:</strong> Vytvořte <strong>jednosměrnou řiditelnou asociaci</strong> (v tomto kroku zatím bez kosočtverce) směřující z <code>BankovniUcet</code> na <code>Transakce</code> (otevřená šipka u <code>Transakce</code>). Na straně <code>BankovniUcet</code> uveďte multiplicitu <code>1</code>, na straně <code>Transakce</code> uveďte multiplicitu <code>0..*</code> a roli <code>transakce</code> (odpovídající atributu <code>-transakce: List&lt;Transakce&gt;</code>).</li>
        <li><strong>Nová vazba Transakce → PlatebniKarta:</strong> Vytvořte <strong>jednosměrnou řiditelnou asociaci</strong> směřující z <code>Transakce</code> na <code>PlatebniKarta</code> (otevřená šipka u <code>PlatebniKarta</code>). Na straně <code>Transakce</code> uveďte multiplicitu <code>0..*</code>, na straně <code>PlatebniKarta</code> uveďte multiplicitu <code>0..1</code> a roli <code>pouzitaKarta</code> (odpovídající atributu <code>-pouzitaKarta: PlatebniKarta</code>).</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající třídy <code>Klient</code>, <code>BankovniUcet</code> (aktualizovaný o <code>-transakce: List&lt;Transakce&gt;</code>) i jejich jednosměrnou řiditelnou asociaci <code>Klient (1)</code> → <code>BankovniUcet (1..*, role: ucty)</code>.',
      'Přidejte z palety nové třídy <strong>Transakce</strong> (s referenčním atributem <code>-pouzitaKarta: PlatebniKarta</code>) a <strong>PlatebniKarta</strong>.',
      'Vytvořte jednosměrnou řiditelnou asociaci <code>BankovniUcet (1)</code> → <code>Transakce (0..*, role: transakce)</code> (zatím bez kosočtverce).',
      'Vytvořte jednosměrnou řiditelnou asociaci <code>Transakce (0..*)</code> → <code>PlatebniKarta (0..1, role: pouzitaKarta)</code>.'
    ],
    hints: [
      'V tomto kroku je vazba BankovniUcet → Transakce záměrně ještě jednosměrnou asociací bez kosočtverce; na kompozici ji zpřesníme v kroku 2.3. Cílové role transakce a pouzitaKarta odpovídají referenčním atributům ve zdrojových třídách.'
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
          navigability: 'unidirectional',
          sourceId: 'banka-klient',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'banka-ucet',
          targetMultiplicity: '1..*',
          targetRole: 'ucty'
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
          feedback: {
            wrongType: 'V tomto kroku (2.2) modeluj vazbu BankovniUcet → Transakce zatím jako jednosměrnou řiditelnou asociaci bez kosočtverce.',
            wrongTargetRole: 'U vazby BankovniUcet → Transakce doplň na straně Transakce roli „transakce“ odpovídající referenčnímu atributu -transakce: List<Transakce>.'
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
          feedback: {
            wrongTargetMultiplicity: 'U vazby Transakce → PlatebniKarta nastav na straně PlatebniKarta multiplicitu „0..1“ (bezhotovostní převod kartu nevyužívá).',
            wrongTargetRole: 'U vazby Transakce → PlatebniKarta doplň na straně PlatebniKarta roli „pouzitaKarta“ odpovídající referenčnímu atributu -pouzitaKarta: PlatebniKarta.'
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
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.2</strong> a doplňte organizační strukturu banky společně s vazbami typu celek–část (agregace a kompozice). Všechny dosavadní prvky z předchozího kroku zachovejte a proveďte přesně následující změny (cílová role každé vazby ukazuje na odpovídající referenční atribut ve zdrojové třídě):</p>
      <ul>
        <li><strong>Nová konkrétní třída Banka:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>nazev</code> typu <code>String</code>, <code>kodBanky</code> typu <code>String</code>, <code>swiftKod</code> typu <code>String</code> a referenčním atributem <code>pobocky</code> typu <code>List&lt;Pobocka&gt;</code>. Přidejte tři veřejné operace (<code>+</code>): <code>pridejPobocku</code> s parametrem <code>pobocka</code> typu <code>Pobocka</code> vracející <code>void</code>, <code>najdiPobocku</code> s parametrem <code>kodPobocky</code> typu <code>String</code> vracející <code>Pobocka</code> a bezparametrickou operaci <code>ziskejPocetPobocek</code> vracející <code>int</code>.</li>
        <li><strong>Nová konkrétní třída Pobocka:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>kodPobocky</code> typu <code>String</code>, <code>adresa</code> typu <code>String</code>, <code>mesto</code> typu <code>String</code> a referenčním atributem <code>kmenoviKlienti</code> typu <code>List&lt;Klient&gt;</code>. Přidejte tři veřejné operace (<code>+</code>): <code>priradKlienta</code> s parametrem <code>klient</code> typu <code>Klient</code> vracející <code>void</code>, <code>odeberKlienta</code> s parametrem <code>klientId</code> typu <code>String</code> vracející <code>boolean</code> a <code>najdiKlienta</code> s parametrem <code>klientId</code> typu <code>String</code> vracející <code>Klient</code>.</li>
        <li><strong>Nová kompozice Banka ◆→ Pobocka:</strong> Pobočka je existenčně závislou součástí banky a zaniká společně s ní. Vytvořte <strong>jednosměrnou řiditelnou kompozici</strong> z celku <code>Banka</code> (plný kosočtverec u <code>Banka</code>) k části <code>Pobocka</code> (šipka u <code>Pobocka</code>). Na straně <code>Banka</code> uveďte multiplicitu <code>1</code>, na straně <code>Pobocka</code> uveďte multiplicitu <code>1..*</code> a roli <code>pobocky</code> (odpovídající atributu <code>-pobocky: List&lt;Pobocka&gt;</code>).</li>
        <li><strong>Nová agregace Pobocka ◇→ Klient:</strong> Pobočka sdružuje své kmenové klienty s nezávislým životním cyklem (při zrušení pobočky klienti nezanikají). Vytvořte <strong>jednosměrnou řiditelnou agregaci</strong> z celku <code>Pobocka</code> (prázdný kosočtverec u <code>Pobocka</code>) k části <code>Klient</code> (šipka u <code>Klient</code>). Na straně <code>Pobocka</code> uveďte multiplicitu <code>0..1</code>, na straně <code>Klient</code> uveďte multiplicitu <code>0..*</code> a roli <code>kmenoviKlienti</code> (odpovídající atributu <code>-kmenoviKlienti: List&lt;Klient&gt;</code>).</li>
        <li><strong>Zpřesnění stávající vazby BankovniUcet → Transakce:</strong> Transakční záznamy jsou nedílnou součástí účtu a při jeho zrušení zanikají s ním. Změňte typ této stávající jednosměrné asociace na <strong>jednosměrnou řiditelnou kompozici</strong> (doplňte plný kosočtverec na stranu <code>BankovniUcet</code>); směr šipky k <code>Transakce</code>, multiplicity (<code>1</code> a <code>0..*</code>) i roli <code>transakce</code> ponechte beze změny.</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající 4 třídy i vazby <code>Klient → BankovniUcet</code> a <code>Transakce → PlatebniKarta</code>.',
      'Přidejte z palety nové třídy <strong>Banka</strong> (s referenčním atributem <code>-pobocky: List&lt;Pobocka&gt;</code>) a <strong>Pobocka</strong> (s referenčním atributem <code>-kmenoviKlienti: List&lt;Klient&gt;</code>).',
      'Vytvořte jednosměrnou řiditelnou <strong>kompozici</strong> <code>Banka (1)</code> ◆→ <code>Pobocka (1..*, role: pobocky)</code>.',
      'Vytvořte jednosměrnou řiditelnou <strong>agregaci</strong> <code>Pobocka (0..1)</code> ◇→ <code>Klient (0..*, role: kmenoviKlienti)</code>.',
      'Klikněte na existující vazbu <code>BankovniUcet → Transakce</code> a změňte její typ na jednosměrnou řiditelnou <strong>kompozici</strong> (plný kosočtverec u <code>BankovniUcet</code>).'
    ],
    hints: [
      'Nezapomeňte kliknout na stávající vazbu BankovniUcet → Transakce a přepnout ji z jednosměrné asociace na jednosměrnou kompozici (◆──>).'
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
          feedback: {
            wrongType: 'Vazba mezi třídami Banka a Pobocka má nastavený jiný typ, ale pobočka nemůže existovat bez banky – použij jednosměrnou řiditelnou kompozici (plný kosočtverec).',
            wrongSourceMultiplicity: 'U kompozice Banka ◆→ Pobocka musí být na straně celku (Banka) multiplicita „1“.',
            wrongTargetMultiplicity: 'Banka musí provozovat alespoň jednu pobočku – na straně Pobocka uveď multiplicitu „1..*“.',
            wrongTargetRole: 'U kompozice Banka ◆→ Pobocka uveď na straně Pobocka roli „pobocky“ odpovídající referenčnímu atributu -pobocky: List<Pobocka>.'
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
          feedback: {
            wrongType: 'Při zrušení pobočky klienti nezanikají (mají nezávislý životní cyklus) – mezi Pobocka a Klient použij jednosměrnou řiditelnou agregaci (prázdný kosočtverec).',
            wrongSourceMultiplicity: 'U agregace Pobocka ◇→ Klient uveď na straně Pobocka multiplicitu „0..1“ (klient může existovat i bez kmenové pobočky).',
            wrongTargetRole: 'U agregace Pobocka ◇→ Klient uveď na straně Klient roli „kmenoviKlienti“ odpovídající referenčnímu atributu -kmenoviKlienti: List<Klient>.'
          }
        },
        {
          id: 'banka-rel-klient-ucet',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'banka-klient',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'banka-ucet',
          targetMultiplicity: '1..*',
          targetRole: 'ucty'
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
          feedback: {
            wrongType: 'Stávající vazbu BankovniUcet → Transakce je v tomto kroku nutné zpřesnit z jednosměrné asociace na jednosměrnou řiditelnou kompozici (plný kosočtverec u BankovniUcet).',
            wrongTargetRole: 'U kompozice BankovniUcet ◆→ Transakce ponech na straně Transakce roli „transakce“ odpovídající referenčnímu atributu -transakce: List<Transakce>.'
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
          targetRole: 'pouzitaKarta'
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
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.3</strong> a dokončete jej do finální celistvé podoby zavedením abstraktní nadtřídy, dědičné hierarchie typů účtů a vazby pro vydávání platebních karet. Všechny ostatní dosavadní třídy, referenční atributy a vazby zachovejte beze změny a proveďte přesně tyto úpravy:</p>
      <ul>
        <li><strong>Refaktoring třídy BankovniUcet:</strong> Změňte třídu <code>BankovniUcet</code> na <strong>abstraktní třídu</strong> (<code>abstract</code>). Změňte viditelnost atributů <code>zustatek</code> (<code>BigDecimal</code>) a <code>aktivni</code> (<code>boolean</code>) ze soukromé (<code>-</code>) na chráněnou (<code>#</code>) (atributy <code>cisloUctu</code>, <code>datumZalozeni</code> a referenční atribut <code>transakce</code> zůstávají soukromé <code>-</code>). Označte veřejnou operaci <code>+vyber(castka: BigDecimal): boolean</code> jako abstraktní (<code>{abstract}</code>). Změňte viditelnost operace <code>pridejTransakci(transakce: Transakce): void</code> ze soukromé (<code>-</code>) na chráněnou (<code>#</code>) <em>(refaktoring třídy se automaticky projevil na tvém plátně)</em>.</li>
        <li><strong>Nová konkrétní podtřída BeznyUcet:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>kontokorentLimit</code> typu <code>BigDecimal</code>, <code>mesicniPoplatek</code> typu <code>BigDecimal</code> a soukromým referenčním atributem <code>platebniKarta</code> typu <code>PlatebniKarta</code>. Přidejte čtyři veřejné operace (<code>+</code>): <code>vyber</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>, <code>vyberKartou</code> s parametry <code>castka</code> typu <code>BigDecimal</code> a <code>pin</code> typu <code>String</code> vracející <code>boolean</code>, <code>nastavKontokorent</code> s parametrem <code>novyLimit</code> typu <code>BigDecimal</code> vracející <code>boolean</code> a <code>vystavKartu</code> s parametry <code>cisloKarty</code> typu <code>String</code>, <code>pinHash</code> typu <code>String</code> a <code>denniLimit</code> typu <code>BigDecimal</code> vracející <code>PlatebniKarta</code>. Dále přidejte jednu soukromou pomocnou operaci (<code>-</code>) <code>overDostupnyZustatek</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová konkrétní podtřída SporiciUcet:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>urokovaSazba</code> typu <code>double</code> a <code>minimalniZustatek</code> typu <code>BigDecimal</code>. Přidejte tři veřejné operace (<code>+</code>): <code>vyber</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>, bezparametrickou operaci <code>pripisUrok</code> vracející <code>BigDecimal</code> a operaci <code>zmenUrokovouSazbu</code> s parametrem <code>novaSazba</code> typu <code>double</code> vracející <code>void</code>.</li>
        <li><strong>Nové vazby generalizace:</strong> Napojte obě nové podtřídy na abstraktní nadtřídu <code>BankovniUcet</code> pomocí <strong>dvou vazeb generalizace</strong> (plná čára s prázdnou trojúhelníkovou šipkou směřující k <code>BankovniUcet</code>): <code>BeznyUcet</code> dědí z <code>BankovniUcet</code> a <code>SporiciUcet</code> dědí z <code>BankovniUcet</code>.</li>
        <li><strong>Nová kompozice BeznyUcet ◆→ PlatebniKarta:</strong> Platební kartu lze vydat výhradně k běžnému účtu, na němž je existenčně závislá a při jeho zrušení zaniká. Vytvořte <strong>jednosměrnou řiditelnou kompozici</strong> z celku <code>BeznyUcet</code> (plný kosočtverec u <code>BeznyUcet</code>) k části <code>PlatebniKarta</code> (šipka u <code>PlatebniKarta</code>). Na straně <code>BeznyUcet</code> uveďte multiplicitu <code>1</code>, na straně <code>PlatebniKarta</code> uveďte multiplicitu <code>0..1</code> a roli <code>platebniKarta</code> (odpovídající referenčnímu atributu <code>-platebniKarta: PlatebniKarta</code> ve třídě <code>BeznyUcet</code>).</li>
      </ul>
    `,
    requirements: [
      'Zachovejte všech 6 dosavadních tříd (včetně aktualizované abstraktní třídy <code>BankovniUcet</code>) a všech 5 vazeb z kroku 2.3.',
      'Přidejte z palety konkrétní podtřídy <strong>BeznyUcet</strong> (s referenčním atributem <code>-platebniKarta: PlatebniKarta</code>) a <strong>SporiciUcet</strong>.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>BeznyUcet</code> (potomek) k <code>BankovniUcet</code> (rodič) bez multiplicit a rolí.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>SporiciUcet</code> (potomek) k <code>BankovniUcet</code> (rodič) bez multiplicit a rolí.',
      'Vytvořte jednosměrnou řiditelnou <strong>kompozici</strong> <code>BeznyUcet (1)</code> ◆→ <code>PlatebniKarta (0..1, role: platebniKarta)</code>.'
    ],
    hints: [
      'Nezapomeňte kromě obou generalizací doplnit také jednosměrnou kompozici BeznyUcet (1) ◆→ PlatebniKarta (0..1, role platebniKarta odpovídající atributu -platebniKarta: PlatebniKarta).'
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
          targetRole: 'pobocky'
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
          targetRole: 'kmenoviKlienti'
        },
        {
          id: 'banka-rel-klient-ucet',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'banka-klient',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 'banka-ucet',
          targetMultiplicity: '1..*',
          targetRole: 'ucty'
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
          targetRole: 'transakce'
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
          feedback: {
            wrongType: 'Platební karta je existenčně vázána na běžný účet – mezi BeznyUcet a PlatebniKarta použij jednosměrnou řiditelnou kompozici (plný kosočtverec u BeznyUcet).',
            wrongSourceMultiplicity: 'U kompozice BeznyUcet ◆→ PlatebniKarta musí být na straně celku (BeznyUcet) multiplicita „1“.',
            wrongTargetMultiplicity: 'K běžnému účtu lze vydat nejvýše jednu platební kartu (nebo žádnou) – na straně PlatebniKarta uveď multiplicitu „0..1“.',
            wrongTargetRole: 'U kompozice BeznyUcet ◆→ PlatebniKarta uveď na straně PlatebniKarta roli „platebniKarta“ odpovídající referenčnímu atributu -platebniKarta: PlatebniKarta.'
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
          targetRole: 'pouzitaKarta'
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

const GEO_CLASS_TVAR_STEP1 = {
  id: 'geo-tvar',
  kind: 'class',
  name: 'Tvar',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'tvarId', type: 'String', isStatic: false },
    { visibility: '-', name: 'rotaceStupne', type: 'double', isStatic: false },
    { visibility: '-', name: 'viditelny', type: 'boolean', isStatic: false },
    { visibility: '-', name: 'styl', type: 'Styl', isStatic: false }
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

const GEO_CLASS_TVAR_STEP2_3 = {
  id: 'geo-tvar',
  kind: 'class',
  name: 'Tvar',
  isAbstract: false,
  attributes: [
    { visibility: '-', name: 'tvarId', type: 'String', isStatic: false },
    { visibility: '-', name: 'rotaceStupne', type: 'double', isStatic: false },
    { visibility: '-', name: 'viditelny', type: 'boolean', isStatic: false },
    { visibility: '-', name: 'styl', type: 'Styl', isStatic: false },
    { visibility: '-', name: 'kotevniBod', type: 'Bod', isStatic: false }
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
    { visibility: '#', name: 'viditelny', type: 'boolean', isStatic: false },
    { visibility: '-', name: 'styl', type: 'Styl', isStatic: false },
    { visibility: '-', name: 'kotevniBod', type: 'Bod', isStatic: false }
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
    { visibility: '-', name: 'barvaPozadi', type: 'String', isStatic: false },
    { visibility: '-', name: 'oznacenyTvar', type: 'Tvar', isStatic: false }
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
    { visibility: '-', name: 'barvaPozadi', type: 'String', isStatic: false },
    { visibility: '-', name: 'oznacenyTvar', type: 'Tvar', isStatic: false },
    { visibility: '-', name: 'vrstvy', type: 'List<Vrstva>', isStatic: false }
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
    { visibility: '-', name: 'zamcena', type: 'boolean', isStatic: false },
    { visibility: '-', name: 'tvary', type: 'List<Tvar>', isStatic: false }
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
    { visibility: '-', name: 'popis', type: 'String', isStatic: false },
    { visibility: '-', name: 'styly', type: 'List<Styl>', isStatic: false }
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
  // Krok 1 (2.1): Základní třídy, zapouzdření a řiditelná asociace s multiplicitami
  // --------------------------------------------------------------------------
  {
    id: 'p-geo-01',
    order: 1,
    title: '2.1 Základní třídy, zapouzdření a řiditelná asociace s multiplicitami',
    shortTitle: '2.1 Tvar a Styl',
    storyIntro: 'Vítej v ateliéru vektorové grafiky! Nejprve založíme jádro grafického editoru: propojíme geometrický tvar s jeho vizuálním stylem pomocí jednosměrné řiditelné asociace.',
    inheritPreviousCanvas: false,
    previousSubchapterId: null,
    assignmentTitle: 'Geometrie 1/4: Základní třídy, zapouzdření a řiditelná asociace s multiplicitami',
    assignmentHtml: `
      <p>Vytvořte výchozí návrhový diagram tříd (UML 2.5) pro doménu <strong>Geometrie (Malování)</strong> určený pro implementaci v jazyce Java. Diagram v tomto prvním kroku obsahuje <strong>přesně dvě konkrétní třídy propojené jednou jednosměrnou řiditelnou asociací</strong>. Každá řiditelná vazba je ve zdrojové třídě realizována soukromým referenčním atributem, na který ukazuje cílová role; nemodelujte konstruktory ani žádné nespecifikované atributy či metody.</p>
      <p>Vytvořte konkrétní třídu <strong>Tvar</strong> (v tomto kroku zatím jako běžnou konkrétní třídu, nikoli abstraktní) se všemi atributy soukromými (<code>-</code>): <code>tvarId</code> typu <code>String</code>, <code>rotaceStupne</code> typu <code>double</code>, <code>viditelny</code> typu <code>boolean</code> a referenčním atributem <code>styl</code> typu <code>Styl</code>. Třída poskytuje šest veřejných operací (<code>+</code>): bezparametrické operace <code>vypoctiObsah</code> vracející <code>double</code>, <code>vypoctiObvod</code> vracející <code>double</code> a <code>vykresli</code> vracející <code>void</code>, dále operaci <code>posun</code> s parametry <code>dx</code> typu <code>double</code> a <code>dy</code> typu <code>double</code> vracející <code>void</code>, operaci <code>otoc</code> s parametrem <code>uhelStupne</code> typu <code>double</code> vracející <code>void</code> a operaci <code>priradStyl</code> s parametrem <code>styl</code> typu <code>Styl</code> vracející <code>void</code>. Dále obsahuje jednu soukromou pomocnou operaci (<code>-</code>) <code>normalizujUhel</code> s parametrem <code>uhel</code> typu <code>double</code> vracející <code>double</code>.</p>
      <p>Vytvořte konkrétní třídu <strong>Styl</strong> se všemi atributy soukromými (<code>-</code>): <code>stylId</code> typu <code>String</code>, <code>barvaVyplne</code> typu <code>String</code>, <code>barvaObrysu</code> typu <code>String</code>, <code>tloustkaObrysu</code> typu <code>double</code> a <code>pruhlednost</code> typu <code>double</code>. Třída poskytuje tři veřejné operace (<code>+</code>): <code>zmenBarvuVyplne</code> s parametrem <code>hexBarva</code> typu <code>String</code> vracející <code>boolean</code>, <code>zmenBarvuObrysu</code> s parametrem <code>hexBarva</code> typu <code>String</code> vracející <code>boolean</code> a <code>nastavTloustkuObrysu</code> s parametrem <code>tloustka</code> typu <code>double</code> vracející <code>boolean</code>. Dále obsahuje jednu soukromou validační operaci (<code>-</code>) <code>jePlatnaHexBarva</code> s parametrem <code>hexBarva</code> typu <code>String</code> vracející <code>boolean</code>.</p>
      <p>Třídy <strong>Tvar</strong> a <strong>Styl</strong> propojte <strong>jednosměrnou řiditelnou asociací</strong> směřující z <code>Tvar</code> na <code>Styl</code> (otevřená šipka u <code>Styl</code>). Jeden styl může používat libovolný počet tvarů nebo žádný (multiplicita <code>0..*</code> na straně <code>Tvar</code>) a každý tvar může mít přiřazen nejvýše jeden styl nebo žádný (multiplicita <code>0..1</code> a role <code>styl</code> na straně <code>Styl</code>, odpovídající referenčnímu atributu <code>-styl: Styl</code> ve třídě <code>Tvar</code>).</p>
    `,
    requirements: [
      'Umístěte na plátno konkrétní třídy <strong>Tvar</strong> (včetně referenčního atributu <code>-styl: Styl</code>) a <strong>Styl</strong>.',
      'Propojte je <strong>jednosměrnou řiditelnou asociací</strong> směřující z <code>Tvar</code> na <code>Styl</code> (otevřená šipka u <code>Styl</code>).',
      'Nastavte multiplicitu <code>0..*</code> na straně <code>Tvar</code> a multiplicitu <code>0..1</code> s rolí <code>styl</code> na straně <code>Styl</code>.'
    ],
    hints: [
      'Cílová role styl ukazuje přímo na soukromý referenční atribut -styl: Styl ve třídě Tvar. Nechte si kolem obou tříd dostatek prostoru pro další kroky.'
    ],
    classes: [
      GEO_CLASS_TVAR_STEP1,
      GEO_CLASS_STYL
    ],
    validationRules: {
      counts: { classifiers: 2, relations: 1 },
      expectedClasses: ['geo-tvar', 'geo-styl'],
      expectedRelations: [
        {
          id: 'geo-rel-tvar-styl',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'geo-tvar',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'geo-styl',
          targetMultiplicity: '0..1',
          targetRole: 'styl',
          feedback: {
            wrongType: 'Mezi třídami Tvar a Styl použij jednosměrnou řiditelnou asociaci (otevřená šipka u Styl), nikoli obousměrnou asociaci (<-->).',
            wrongDirection: 'Šipka řiditelnosti musí směřovat od Tvar (který drží referenční atribut styl) ke Styl.',
            wrongSourceMultiplicity: 'U vazby Tvar → Styl nastav na straně Tvar multiplicitu „0..*“ (jeden styl může používat nula až libovolný počet tvarů).',
            wrongTargetMultiplicity: 'U vazby Tvar → Styl nastav na straně Styl multiplicitu „0..1“ (tvar může mít přiřazen nejvýše jeden styl nebo žádný).',
            wrongTargetRole: 'U vazby Tvar → Styl doplň na straně Styl roli „styl“ odpovídající referenčnímu atributu -styl: Styl ve třídě Tvar.'
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 2 (2.2): Řiditelnost asociací, role a referenční atributy
  // --------------------------------------------------------------------------
  {
    id: 'p-geo-02',
    order: 2,
    title: '2.2 Řiditelnost asociací, role a referenční atributy',
    shortTitle: '2.2 Plátno a Kotevní bod',
    storyIntro: 'Skvěle! Třída Tvar získala referenční atribut kotevniBod – teď na plátno doplníme pracovní Platno a souřadnicový Bod a propojíme je jednosměrnými řiditelnými asociacemi.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-geo-01',
    assignmentTitle: 'Geometrie 2/4: Řiditelnost asociací, role a referenční atributy',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.1</strong> a rozšiřte jej o pracovní plátno, kotevní bod tvarů a jednosměrně řiditelné asociace s rolemi navázanými na referenční atributy. Stávající třídy i vazbu <code>Tvar → Styl</code> zachovejte a proveďte přesně následující úpravy a doplnění:</p>
      <ul>
        <li><strong>Úprava stávající třídy Tvar:</strong> Doplňte soukromý referenční atribut (<code>-</code>) <code>kotevniBod</code> typu <code>Bod</code> <em>(aktualizace se automaticky promítla na kartě třídy na plátně)</em>.</li>
        <li><strong>Nová konkrétní třída Platno</strong> (základní rozsah před zavedením vrstev): Přidejte třídu se soukromými atributy (<code>-</code>): <code>nazev</code> typu <code>String</code>, <code>sirkaPx</code> typu <code>int</code>, <code>vyskaPx</code> typu <code>int</code>, <code>barvaPozadi</code> typu <code>String</code> a referenčním atributem <code>oznacenyTvar</code> typu <code>Tvar</code>. Přidejte tři veřejné operace (<code>+</code>): <code>oznacTvar</code> s parametrem <code>tvar</code> typu <code>Tvar</code> vracející <code>void</code>, bezparametrickou operaci <code>zrusOznaceni</code> vracející <code>void</code> a bezparametrickou operaci <code>vykresli</code> vracející <code>void</code>.</li>
        <li><strong>Nová konkrétní třída Bod:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>x</code> typu <code>double</code> a <code>y</code> typu <code>double</code>. Přidejte čtyři veřejné operace (<code>+</code>): <code>posunO</code> s parametry <code>dx</code> typu <code>double</code> a <code>dy</code> typu <code>double</code> vracející <code>void</code>, <code>vzdalenostOd</code> s parametrem <code>cilovyBod</code> typu <code>Bod</code> vracející <code>double</code>, bezparametrickou operaci <code>ziskejX</code> vracející <code>double</code> a bezparametrickou operaci <code>ziskejY</code> vracející <code>double</code>.</li>
        <li><strong>Nová vazba Platno → Tvar:</strong> Vytvořte <strong>jednosměrnou řiditelnou asociaci</strong> směřující z <code>Platno</code> na <code>Tvar</code> (otevřená šipka u <code>Tvar</code>). Na straně <code>Platno</code> uveďte multiplicitu <code>0..1</code>, na straně <code>Tvar</code> uveďte multiplicitu <code>0..1</code> a roli <code>oznacenyTvar</code> (odpovídající atributu <code>-oznacenyTvar: Tvar</code>).</li>
        <li><strong>Nová vazba Tvar → Bod:</strong> Vytvořte <strong>jednosměrnou řiditelnou asociaci</strong> (v tomto kroku zatím bez kosočtverce) směřující z <code>Tvar</code> na <code>Bod</code> (otevřená šipka u <code>Bod</code>). Na straně <code>Tvar</code> uveďte multiplicitu <code>1</code>, na straně <code>Bod</code> uveďte multiplicitu <code>1</code> a roli <code>kotevniBod</code> (odpovídající atributu <code>-kotevniBod: Bod</code>).</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající třídy <code>Tvar</code> (aktualizovaný o <code>-kotevniBod: Bod</code>), <code>Styl</code> i jejich jednosměrnou řiditelnou asociaci <code>Tvar (0..*)</code> → <code>Styl (0..1, role: styl)</code>.',
      'Přidejte z palety nové třídy <strong>Platno</strong> (s referenčním atributem <code>-oznacenyTvar: Tvar</code>) a <strong>Bod</strong>.',
      'Vytvořte jednosměrnou řiditelnou asociaci <code>Platno (0..1)</code> → <code>Tvar (0..1, role: oznacenyTvar)</code>.',
      'Vytvořte jednosměrnou řiditelnou asociaci <code>Tvar (1)</code> → <code>Bod (1, role: kotevniBod)</code> (zatím bez kosočtverce).'
    ],
    hints: [
      'V tomto kroku je vazba Tvar → Bod záměrně ještě jednosměrnou asociací bez kosočtverce; na kompozici ji změníme v dalším kroku. Cílové role oznacenyTvar a kotevniBod odpovídají referenčním atributům ve zdrojových třídách.'
    ],
    classes: [
      GEO_CLASS_PLATNO_BASE,
      GEO_CLASS_TVAR_STEP2_3,
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
          feedback: {
            wrongSourceMultiplicity: 'U vazby Platno → Tvar nastav na straně Platno multiplicitu „0..1“.',
            wrongTargetMultiplicity: 'U vazby Platno → Tvar nastav na straně Tvar multiplicitu „0..1“ (na plátně nemusí být vybrán žádný tvar, nebo nejvýše jeden).',
            wrongTargetRole: 'U vazby Platno → Tvar doplň na straně Tvar roli „oznacenyTvar“ odpovídající referenčnímu atributu -oznacenyTvar: Tvar.'
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
          feedback: {
            wrongType: 'V tomto kroku (2.2) modeluj vazbu Tvar → Bod zatím jako jednosměrnou řiditelnou asociaci bez kosočtverce.',
            wrongTargetRole: 'U vazby Tvar → Bod doplň na straně Bod roli „kotevniBod“ odpovídající referenčnímu atributu -kotevniBod: Bod.'
          }
        },
        {
          id: 'geo-rel-tvar-styl',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'geo-tvar',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'geo-styl',
          targetMultiplicity: '0..1',
          targetRole: 'styl'
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
    storyIntro: 'Třída Platno automaticky získala referenční atribut vrstvy i operace pro správu vrstev. Teď model obohať o Vrstvu, Paletu, silné kompozice (včetně zpřesnění vazby k Bodu) a slabou agregaci palety stylů.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-geo-02',
    assignmentTitle: 'Geometrie 3/4: Vazby celek–část (agregace a kompozice)',
    assignmentHtml: `
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.2</strong> a rozšiřte jej o vrstvy plátna, tematické palety stylů a vazby typu celek–část (agregace a kompozice). Všechny dosavadní prvky z předchozího kroku zachovejte a proveďte přesně následující změny (cílová role každé vazby ukazuje na odpovídající referenční atribut ve zdrojové třídě):</p>
      <ul>
        <li><strong>Úprava stávající třídy Platno:</strong> Doplňte soukromý referenční atribut (<code>-</code>) <code>vrstvy</code> typu <code>List&lt;Vrstva&gt;</code> a dvě veřejné operace (<code>+</code>) pro správu vrstev: <code>pridejVrstvu</code> s parametrem <code>vrstva</code> typu <code>Vrstva</code> vracející <code>void</code> a <code>odeberVrstvu</code> s parametrem <code>vrstvaId</code> typu <code>String</code> vracející <code>boolean</code> <em>(aktualizace se automaticky promítla na kartě třídy na plátně)</em>.</li>
        <li><strong>Nová konkrétní třída Vrstva:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>vrstvaId</code> typu <code>String</code>, <code>nazev</code> typu <code>String</code>, <code>poradiZ</code> typu <code>int</code>, <code>viditelna</code> typu <code>boolean</code>, <code>zamcena</code> typu <code>boolean</code> a referenčním atributem <code>tvary</code> typu <code>List&lt;Tvar&gt;</code>. Přidejte pět veřejných operací (<code>+</code>): <code>pridejTvar</code> s parametrem <code>tvar</code> typu <code>Tvar</code> vracející <code>boolean</code>, <code>odeberTvar</code> s parametrem <code>tvarId</code> typu <code>String</code> vracející <code>boolean</code>, <code>najdiTvar</code> s parametrem <code>tvarId</code> typu <code>String</code> vracející <code>Tvar</code>, <code>nastavViditelnost</code> s parametrem <code>viditelna</code> typu <code>boolean</code> vracející <code>void</code> a bezparametrickou operaci <code>ziskejPocetTvaru</code> vracející <code>int</code>.</li>
        <li><strong>Nová konkrétní třída Paleta:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>nazev</code> typu <code>String</code>, <code>popis</code> typu <code>String</code> a referenčním atributem <code>styly</code> typu <code>List&lt;Styl&gt;</code>. Přidejte čtyři veřejné operace (<code>+</code>): <code>pridejStyl</code> s parametrem <code>styl</code> typu <code>Styl</code> vracející <code>void</code>, <code>odeberStyl</code> s parametrem <code>stylId</code> typu <code>String</code> vracející <code>boolean</code>, <code>najdiStyl</code> s parametrem <code>stylId</code> typu <code>String</code> vracející <code>Styl</code> a bezparametrickou operaci <code>ziskejPocetStylu</code> vracející <code>int</code>.</li>
        <li><strong>Nová kompozice Platno ◆→ Vrstva:</strong> Vrstva je existenčně závislou součástí plátna a při jeho odstranění zaniká. Vytvořte <strong>jednosměrnou řiditelnou kompozici</strong> z celku <code>Platno</code> (plný kosočtverec u <code>Platno</code>) k části <code>Vrstva</code> (šipka u <code>Vrstva</code>). Na straně <code>Platno</code> uveďte multiplicitu <code>1</code>, na straně <code>Vrstva</code> uveďte multiplicitu <code>1..*</code> a roli <code>vrstvy</code> (odpovídající atributu <code>-vrstvy: List&lt;Vrstva&gt;</code>).</li>
        <li><strong>Nová kompozice Vrstva ◆→ Tvar:</strong> Nakreslené tvary jsou existenčně svázány se svou vrstvou a při jejím smazání zanikají. Vytvořte <strong>jednosměrnou řiditelnou kompozici</strong> z celku <code>Vrstva</code> (plný kosočtverec u <code>Vrstva</code>) k části <code>Tvar</code> (šipka u <code>Tvar</code>). Na straně <code>Vrstva</code> uveďte multiplicitu <code>1</code>, na straně <code>Tvar</code> uveďte multiplicitu <code>0..*</code> a roli <code>tvary</code> (odpovídající atributu <code>-tvary: List&lt;Tvar&gt;</code>).</li>
        <li><strong>Zpřesnění stávající vazby Tvar → Bod:</strong> Kotevní bod je neoddělitelnou součástí tvaru a zaniká společně s ním. Změňte typ této stávající jednosměrné asociace na <strong>jednosměrnou řiditelnou kompozici</strong> (doplňte plný kosočtverec na stranu <code>Tvar</code>); směr šipky k <code>Bod</code>, multiplicity (<code>1</code> a <code>1</code>) i roli <code>kotevniBod</code> ponechte beze změny.</li>
        <li><strong>Nová agregace Paleta ◇→ Styl:</strong> Paleta sdružuje styly s nezávislým životním cyklem (při smazání palety styly v systému nadále existují). Vytvořte <strong>jednosměrnou řiditelnou agregaci</strong> z celku <code>Paleta</code> (prázdný kosočtverec u <code>Paleta</code>) k části <code>Styl</code> (šipka u <code>Styl</code>). Na straně <code>Paleta</code> uveďte multiplicitu <code>0..1</code>, na straně <code>Styl</code> uveďte multiplicitu <code>0..*</code> a roli <code>styly</code> (odpovídající atributu <code>-styly: List&lt;Styl&gt;</code>).</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající 4 třídy i vazby <code>Platno → Tvar</code> a <code>Tvar → Styl</code>.',
      'Přidejte z palety nové třídy <strong>Vrstva</strong> (s referenčním atributem <code>-tvary: List&lt;Tvar&gt;</code>) a <strong>Paleta</strong> (s referenčním atributem <code>-styly: List&lt;Styl&gt;</code>).',
      'Vytvořte jednosměrnou řiditelnou <strong>kompozici</strong> <code>Platno (1)</code> ◆→ <code>Vrstva (1..*, role: vrstvy)</code>.',
      'Vytvořte jednosměrnou řiditelnou <strong>kompozici</strong> <code>Vrstva (1)</code> ◆→ <code>Tvar (0..*, role: tvary)</code>.',
      'Klikněte na stávající vazbu <code>Tvar → Bod</code> a přepněte ji na jednosměrnou řiditelnou <strong>kompozici</strong> (plný kosočtverec u <code>Tvar</code>).',
      'Vytvořte jednosměrnou řiditelnou <strong>agregaci</strong> <code>Paleta (0..1)</code> ◇→ <code>Styl (0..*, role: styly)</code>.'
    ],
    hints: [
      'Nezapomeňte upravit existující vazbu Tvar → Bod na kompozici (◆──>) a ponechat původní vazbu Platno → Tvar (role oznacenyTvar) jako jednosměrnou řiditelnou asociaci.'
    ],
    classes: [
      GEO_CLASS_PLATNO_FULL,
      GEO_CLASS_VRSTVA,
      GEO_CLASS_TVAR_STEP2_3,
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
          feedback: {
            wrongType: 'Vrstva nemůže existovat bez plátna – mezi Platno a Vrstva použij jednosměrnou řiditelnou kompozici (plný kosočtverec u Platno).',
            wrongSourceMultiplicity: 'U kompozice Platno ◆→ Vrstva musí být na straně celku (Platno) multiplicita „1“.',
            wrongTargetMultiplicity: 'Každé plátno musí obsahovat alespoň jednu vrstvu – na straně Vrstva uveď multiplicitu „1..*“.',
            wrongTargetRole: 'U kompozice Platno ◆→ Vrstva uveď na straně Vrstva roli „vrstvy“ odpovídající referenčnímu atributu -vrstvy: List<Vrstva>.'
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
          feedback: {
            wrongType: 'Tvary jsou existenčně svázány se svou vrstvou – mezi Vrstva a Tvar použij jednosměrnou řiditelnou kompozici (plný kosočtverec u Vrstva).',
            wrongSourceMultiplicity: 'U kompozice Vrstva ◆→ Tvar musí být na straně celku (Vrstva) multiplicita „1“.',
            wrongTargetRole: 'U kompozice Vrstva ◆→ Tvar uveď na straně Tvar roli „tvary“ odpovídající referenčnímu atributu -tvary: List<Tvar>.'
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
          targetRole: 'oznacenyTvar'
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
          feedback: {
            wrongType: 'Stávající vazbu Tvar → Bod je v tomto kroku nutné zpřesnit z jednosměrné asociace na jednosměrnou řiditelnou kompozici (plný kosočtverec u Tvar).',
            wrongTargetRole: 'U kompozice Tvar ◆→ Bod ponech na straně Bod roli „kotevniBod“ odpovídající referenčnímu atributu -kotevniBod: Bod.'
          }
        },
        {
          id: 'geo-rel-tvar-styl',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'geo-tvar',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'geo-styl',
          targetMultiplicity: '0..1',
          targetRole: 'styl'
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
          feedback: {
            wrongType: 'Při smazání palety styly nadále existují (nezávislý životní cyklus) – mezi Paleta a Styl použij jednosměrnou řiditelnou agregaci (prázdný kosočtverec u Paleta).',
            wrongSourceMultiplicity: 'U agregace Paleta ◇→ Styl uveď na straně Paleta multiplicitu „0..1“ (styl může existovat i mimo paletu).',
            wrongTargetRole: 'U agregace Paleta ◇→ Styl uveď na straně Styl roli „styly“ odpovídající referenčnímu atributu -styly: List<Styl>.'
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
      <p>Navazujte na svůj diagram z <strong>Podkapitoly 2.3</strong> a dokončete jej do finální celistvé podoby převedením třídy <code>Tvar</code> na abstraktní nadtřídu a doplněním konkrétních geometrických specializací. Všechny ostatní dosavadní třídy, referenční atributy a vazby zachovejte beze změny a proveďte přesně tyto úpravy:</p>
      <ul>
        <li><strong>Refaktoring třídy Tvar:</strong> Změňte třídu <code>Tvar</code> na <strong>abstraktní třídu</strong> (<code>abstract</code>). Změňte viditelnost atributů <code>rotaceStupne</code> (<code>double</code>) a <code>viditelny</code> (<code>boolean</code>) ze soukromé (<code>-</code>) na chráněnou (<code>#</code>) (atribut <code>tvarId</code> a referenční atributy <code>styl</code> a <code>kotevniBod</code> zůstávají soukromé <code>-</code>). Označte tři bezparametrické veřejné operace <code>+vypoctiObsah(): double</code>, <code>+vypoctiObvod(): double</code> a <code>+vykresli(): void</code> jako abstraktní (<code>{abstract}</code>). Změňte viditelnost pomocné operace <code>normalizujUhel(uhel: double): double</code> ze soukromé (<code>-</code>) na chráněnou (<code>#</code>) <em>(refaktoring třídy se automaticky projevil na tvém plátně)</em>.</li>
        <li><strong>Nová konkrétní podtřída Kruh:</strong> Přidejte třídu se soukromým atributem (<code>-</code>) <code>polomer</code> typu <code>double</code>. Přidejte pět veřejných operací (<code>+</code>): bezparametrické operace <code>vypoctiObsah</code> vracející <code>double</code>, <code>vypoctiObvod</code> vracející <code>double</code> a <code>vykresli</code> vracející <code>void</code>, dále operaci <code>zmenPolomer</code> s parametrem <code>novyPolomer</code> typu <code>double</code> vracející <code>boolean</code> a operaci <code>obsahujeBod</code> s parametrem <code>bod</code> typu <code>Bod</code> vracející <code>boolean</code>.</li>
        <li><strong>Nová konkrétní podtřída Obdelnik:</strong> Přidejte třídu se soukromými atributy (<code>-</code>): <code>sirka</code> typu <code>double</code>, <code>vyska</code> typu <code>double</code> a <code>zaobleniRohu</code> typu <code>double</code>. Přidejte pět veřejných operací (<code>+</code>): bezparametrické operace <code>vypoctiObsah</code> vracející <code>double</code>, <code>vypoctiObvod</code> vracející <code>double</code>, <code>vykresli</code> vracející <code>void</code> a <code>jeCtverec</code> vracející <code>boolean</code>, a dále operaci <code>zmenRozmery</code> s parametry <code>novaSirka</code> typu <code>double</code> a <code>novaVyska</code> typu <code>double</code> vracející <code>boolean</code>. Přidejte také jednu soukromou pomocnou operaci (<code>-</code>) <code>overRozmery</code> s parametry <code>sirka</code> typu <code>double</code> a <code>vyska</code> typu <code>double</code> vracející <code>boolean</code>.</li>
        <li><strong>Nové vazby generalizace:</strong> Napojte obě nové podtřídy na abstraktní nadtřídu <code>Tvar</code> pomocí <strong>dvou vazeb generalizace</strong> (plná čára s prázdnou trojúhelníkovou šipkou směřující k <code>Tvar</code>): <code>Kruh</code> dědí z <code>Tvar</code> a <code>Obdelnik</code> dědí z <code>Tvar</code>.</li>
      </ul>
    `,
    requirements: [
      'Zachovejte všech 6 dosavadních tříd (včetně aktualizované abstraktní třídy <code>Tvar</code>) a všech 6 vazeb z kroku 2.3.',
      'Přidejte z palety konkrétní podtřídy <strong>Kruh</strong> a <strong>Obdelnik</strong>.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>Kruh</code> (potomek) k <code>Tvar</code> (rodič) bez multiplicit a rolí.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>Obdelnik</code> (potomek) k <code>Tvar</code> (rodič) bez multiplicit a rolí.'
    ],
    hints: [
      'Prázdný trojúhelník u obou generalizací musí směřovat od konkrétních podtříd (Kruh, Obdelnik) k abstraktní nadtřídě Tvar, bez multiplicit a rolí.'
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
          targetRole: 'vrstvy'
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
          targetRole: 'tvary'
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
          targetRole: 'oznacenyTvar'
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
          targetRole: 'kotevniBod'
        },
        {
          id: 'geo-rel-tvar-styl',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'geo-tvar',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 'geo-styl',
          targetMultiplicity: '0..1',
          targetRole: 'styl'
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
          targetRole: 'styly'
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
