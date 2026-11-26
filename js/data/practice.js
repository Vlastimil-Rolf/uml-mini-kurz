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
  // Krok 1 (2.1): Základní třídy, zapouzdření a asociace s multiplicitami
  // --------------------------------------------------------------------------
  {
    id: 'p-auto-01',
    order: 1,
    title: '2.1 Základní třídy, zapouzdření a asociace s multiplicitami',
    shortTitle: '2.1 Zákazník a Vozidlo',
    storyIntro: 'Vítej v dílně Autoservisu! Začneme pevným základem celého systému: propojíme zákazníka s jeho vozidly pomocí asociace se šipkou a cílové role.',
    inheritPreviousCanvas: false,
    previousSubchapterId: null,
    assignmentTitle: 'Autoservis 1/4: Základní třídy, zapouzdření a asociace s multiplicitami',
    assignmentHtml: `
      <p><strong>Připravený model v paletě:</strong> Pro výchozí krok domény <strong>Autoservis</strong> máte v paletě připraveny dvě konkrétní návrhové třídy pro jazyk Java:</p>
      <ul>
        <li><strong>Zakaznik</strong> obsahuje soukromé atributy (<code>-</code>) <code>zakaznikId: String</code>, <code>jmeno: String</code>, <code>prijmeni: String</code>, <code>telefon: String</code>, <code>email: String</code> a soukromý referenční atribut <code>vozidla: List&lt;Vozidlo&gt;</code>. Poskytuje veřejné operace (<code>+</code>) <code>pridejVozidlo(vozidlo: Vozidlo): void</code>, <code>odeberVozidlo(vin: String): boolean</code>, <code>aktualizujTelefon(novyTelefon: String): boolean</code> a <code>ziskejPocetVozidel(): int</code>.</li>
        <li><strong>Vozidlo</strong> (v tomto kroku zatím jako konkrétní třída) obsahuje soukromé atributy (<code>-</code>) <code>vin: String</code>, <code>spz: String</code>, <code>znacka: String</code>, <code>rokVyroby: int</code>, <code>najeteKm: int</code> a <code>technickyZpusobile: boolean</code>, veřejné operace (<code>+</code>) <code>vypoctiZakladniSazbu(): BigDecimal</code>, <code>ziskejTypVozidla(): String</code>, <code>ziskejVin(): String</code>, <code>aktualizujNajezd(noveKm: int): boolean</code>, <code>nastavTechnickouZpusobilost(zpusobile: boolean): void</code> a soukromou pomocnou operaci (<code>-</code>) <code>overNajezd(noveKm: int): boolean</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Umístěte na plátno obě třídy (<code>Zakaznik</code> a <code>Vozidlo</code>) a propojte je <strong>asociací směřující ze <code>Zakaznik</code> na <code>Vozidlo</code></strong> (šipka u <code>Vozidlo</code>). Každé vozidlo patří vždy právě jednomu zákazníkovi (multiplicita <code>1</code> na straně <code>Zakaznik</code>) a každý zákazník musí vlastnit alespoň jedno vozidlo (multiplicita <code>1..*</code> a role <code>vozidla</code> na straně <code>Vozidlo</code>, odpovídající referenčnímu atributu <code>-vozidla: List&lt;Vozidlo&gt;</code> ve třídě <code>Zakaznik</code>).</p>
    `,
    requirements: [
      'Umístěte na plátno konkrétní třídy <strong>Zakaznik</strong> (včetně referenčního atributu <code>-vozidla: List&lt;Vozidlo&gt;</code>) a <strong>Vozidlo</strong>.',
      'Propojte je <strong>asociací</strong> směřující ze <code>Zakaznik</code> na <code>Vozidlo</code> (šipka u <code>Vozidlo</code>).',
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
            wrongType: 'Mezi třídami Zakaznik a Vozidlo použij asociaci se šipkou u Vozidlo, nikoli obousměrnou asociaci (<-->).',
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
    storyIntro: 'Výborně, základ stojí. Teď na tvé plátno přivedeme servisní zakázky a mechaniky – zachovej stávající vazbu a veď asociace od zakázky k přidělenému mechanikovi i opravovanému vozidlu.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-auto-01',
    assignmentTitle: 'Autoservis 2/4: Řiditelnost asociací, role a referenční atributy',
    assignmentHtml: `
      <p><strong>Připravený model v paletě:</strong> Navazujete na svůj diagram z <strong>Podkapitoly 2.1</strong> (třídy <code>Zakaznik</code> a <code>Vozidlo</code> i jejich vazba zůstávají na plátně). V paletě přibyly dvě nové konkrétní třídy:</p>
      <ul>
        <li><strong>Mechanik</strong> obsahuje soukromé atributy (<code>-</code>) <code>mechanikId: String</code>, <code>jmeno: String</code>, <code>prijmeni: String</code>, <code>specializace: String</code> a <code>dostupny: boolean</code> a veřejné operace (<code>+</code>) <code>nastavDostupnost(dostupny: boolean): void</code>, <code>zmenSpecializaci(novaSpecializace: String): void</code> a <code>jeDostupny(): boolean</code>.</li>
        <li><strong>ServisniZakazka</strong> (základní rozsah před zavedením položek zakázky) obsahuje soukromé atributy (<code>-</code>) <code>cisloZakazky: String</code>, <code>datumPrijeti: LocalDateTime</code>, <code>planovaneDokonceni: LocalDate</code>, <code>stav: String</code>, <code>poznamka: String</code> a dva soukromé referenční atributy <code>pridelenyMechanik: Mechanik</code> a <code>opravovaneVozidlo: Vozidlo</code>. Poskytuje veřejné operace (<code>+</code>) <code>priradMechanika(mechanik: Mechanik): void</code>, <code>vypoctiCelkovouCenu(): BigDecimal</code>, <code>uzavriZakazku(): boolean</code> a soukromou pomocnou operaci (<code>-</code>) <code>vypoctiDph(zakladDane: BigDecimal): BigDecimal</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Zachovejte stávající třídy a vazbu <code>Zakaznik → Vozidlo</code>, přidejte z palety třídy <code>Mechanik</code> a <code>ServisniZakazka</code> a vytvořte dvě nové asociace:</p>
      <ul>
        <li><strong>ServisniZakazka → Mechanik:</strong> Vytvořte asociaci směřující ze <code>ServisniZakazka</code> na <code>Mechanik</code> (šipka u <code>Mechanik</code>) s multiplicitou <code>0..*</code> na straně <code>ServisniZakazka</code> a multiplicitou <code>0..1</code> a rolí <code>pridelenyMechanik</code> na straně <code>Mechanik</code> (odpovídající referenčnímu atributu <code>-pridelenyMechanik: Mechanik</code>).</li>
        <li><strong>ServisniZakazka → Vozidlo:</strong> Vytvořte asociaci směřující ze <code>ServisniZakazka</code> na <code>Vozidlo</code> (šipka u <code>Vozidlo</code>) s multiplicitou <code>0..*</code> na straně <code>ServisniZakazka</code> a multiplicitou <code>1</code> a rolí <code>opravovaneVozidlo</code> na straně <code>Vozidlo</code> (odpovídající referenčnímu atributu <code>-opravovaneVozidlo: Vozidlo</code>).</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající třídy <code>Zakaznik</code>, <code>Vozidlo</code> i jejich asociaci <code>Zakaznik (1)</code> → <code>Vozidlo (1..*, role: vozidla)</code>.',
      'Přidejte z palety nové třídy <strong>Mechanik</strong> a <strong>ServisniZakazka</strong> (s referenčními atributy <code>-pridelenyMechanik: Mechanik</code> a <code>-opravovaneVozidlo: Vozidlo</code>).',
      'Vytvořte asociaci <code>ServisniZakazka (0..*)</code> → <code>Mechanik (0..1, role: pridelenyMechanik)</code>.',
      'Vytvořte asociaci <code>ServisniZakazka (0..*)</code> → <code>Vozidlo (1, role: opravovaneVozidlo)</code>.'
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
      <p><strong>Rozšíření modelu a nové třídy v paletě:</strong> Navazujete na svůj diagram z <strong>Podkapitoly 2.2</strong>. Do stávající třídy <code>ServisniZakazka</code> na plátně se automaticky promítl soukromý referenční atribut (<code>-</code>) <code>polozky: List&lt;PolozkaZakazky&gt;</code> a veřejné operace <code>pridejPolozku(polozka: PolozkaZakazky): void</code> a <code>odeberPolozku(polozkaId: String): boolean</code>. V paletě jsou nově připraveny dvě konkrétní třídy:</p>
      <ul>
        <li><strong>Autoservis</strong> obsahuje soukromé atributy (<code>-</code>) <code>nazev: String</code>, <code>ico: String</code>, <code>adresa: String</code>, <code>hodinovaSazba: BigDecimal</code>, soukromé referenční atributy <code>mechanici: List&lt;Mechanik&gt;</code> a <code>zakazky: List&lt;ServisniZakazka&gt;</code> a veřejné operace (<code>+</code>) <code>pridejMechanika(mechanik: Mechanik): void</code>, <code>odeberMechanika(mechanikId: String): boolean</code>, <code>zalozZakazku(zakazka: ServisniZakazka): void</code>, <code>najdiZakazku(cisloZakazky: String): ServisniZakazka</code> a <code>ziskejPocetOtevrenychZakazek(): int</code>.</li>
        <li><strong>PolozkaZakazky</strong> obsahuje soukromé atributy (<code>-</code>) <code>polozkaId: String</code>, <code>popis: String</code>, <code>mnozstvi: double</code>, <code>jednotkovaCena: BigDecimal</code> a <code>jeNahradniDil: boolean</code> a veřejné operace (<code>+</code>) <code>vypoctiMezisoucet(): BigDecimal</code>, <code>upravMnozstvi(noveMnozstvi: double): boolean</code> a <code>zmenJednotkovouCenu(novaCena: BigDecimal): boolean</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Zachovejte všechny dosavadní třídy a vazby z kroku 2.2, přidejte z palety třídy <code>Autoservis</code> a <code>PolozkaZakazky</code> a vytvořte tři vazby typu celek–část:</p>
      <ul>
        <li><strong>Agregace Autoservis ◇→ Mechanik:</strong> Autoservis sdružuje mechaniky s nezávislým životním cyklem (při zrušení autoservisu záznamy mechaniků v systému nadále existují). Vytvořte <strong>agregaci</strong> z celku <code>Autoservis</code> (prázdný kosočtverec u <code>Autoservis</code>) k části <code>Mechanik</code> (šipka u <code>Mechanik</code>) s multiplicitou <code>0..1</code> na straně <code>Autoservis</code> a multiplicitou <code>0..*</code> a rolí <code>mechanici</code> na straně <code>Mechanik</code>.</li>
        <li><strong>Kompozice Autoservis ◆→ ServisniZakazka:</strong> Servisní zakázky jsou existenčně závislou součástí autoservisu a při jeho zrušení zanikají. Vytvořte <strong>kompozici</strong> z celku <code>Autoservis</code> (plný kosočtverec u <code>Autoservis</code>) k části <code>ServisniZakazka</code> (šipka u <code>ServisniZakazka</code>) s multiplicitou <code>1</code> na straně <code>Autoservis</code> a multiplicitou <code>0..*</code> a rolí <code>zakazky</code> na straně <code>ServisniZakazka</code>.</li>
        <li><strong>Kompozice ServisniZakazka ◆→ PolozkaZakazky:</strong> Položky zakázky jsou existenčně vázány na konkrétní zakázku a při jejím odstranění zanikají. Vytvořte <strong>kompozici</strong> z celku <code>ServisniZakazka</code> (plný kosočtverec u <code>ServisniZakazka</code>) k části <code>PolozkaZakazky</code> (šipka u <code>PolozkaZakazky</code>) s multiplicitou <code>1</code> na straně <code>ServisniZakazka</code> a multiplicitou <code>1..*</code> a rolí <code>polozky</code> na straně <code>PolozkaZakazky</code>.</li>
      </ul>
    `,
    requirements: [
      'Zachovejte všechny 4 stávající třídy a 3 vazby z předchozího kroku 2.2.',
      'Přidejte z palety nové třídy <strong>Autoservis</strong> (s referenčními atributy <code>-mechanici: List&lt;Mechanik&gt;</code> a <code>-zakazky: List&lt;ServisniZakazka&gt;</code>) a <strong>PolozkaZakazky</strong>.',
      'Vytvořte <strong>agregaci</strong> <code>Autoservis (0..1)</code> ◇→ <code>Mechanik (0..*, role: mechanici)</code>.',
      'Vytvořte <strong>kompozici</strong> <code>Autoservis (1)</code> ◆→ <code>ServisniZakazka (0..*, role: zakazky)</code>.',
      'Vytvořte <strong>kompozici</strong> <code>ServisniZakazka (1)</code> ◆→ <code>PolozkaZakazky (1..*, role: polozky)</code>.'
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
            wrongType: 'Mechanici mají nezávislý životní cyklus (při zrušení autoservisu nezanikají) – mezi Autoservis a Mechanik použij agregaci (prázdný kosočtverec).',
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
            wrongType: 'Servisní zakázky jsou existenčně závislé na autoservisu – mezi Autoservis a ServisniZakazka použij kompozici (plný kosočtverec).',
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
            wrongType: 'Položky zakázky zanikají spolu se zakázkou – mezi ServisniZakazka a PolozkaZakazky použij kompozici (plný kosočtverec).',
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
      <p><strong>Refaktoring modelu a nové podtřídy v paletě:</strong> Navazujete na svůj diagram z <strong>Podkapitoly 2.3</strong>. Třída <code>Vozidlo</code> na plátně byla automaticky převedena na <strong>abstraktní nadtřídu</strong> (<code>abstract</code>): atributy <code>najeteKm</code> a <code>technickyZpusobile</code> i pomocná operace <code>overNajezd</code> získaly chráněnou viditelnost (<code>#</code>) pro potomky a bezparametrické operace <code>+vypoctiZakladniSazbu(): BigDecimal</code> a <code>+ziskejTypVozidla(): String</code> jsou nyní abstraktní (<code>{abstract}</code>). V paletě jsou nově připraveny dvě konkrétní specializace vozidel:</p>
      <ul>
        <li><strong>OsobniAuto</strong> obsahuje soukromé atributy (<code>-</code>) <code>pocetMist: int</code>, <code>typKaroserie: String</code> a <code>maTazneZarizeni: boolean</code> a veřejné operace (<code>+</code>) <code>vypoctiZakladniSazbu(): BigDecimal</code>, <code>ziskejTypVozidla(): String</code> a <code>nastavTazneZarizeni(pritomno: boolean): void</code>.</li>
        <li><strong>Dodavka</strong> obsahuje soukromé atributy (<code>-</code>) <code>nosnostKg: double</code> a <code>objemNakladuM3: double</code>, veřejné operace (<code>+</code>) <code>vypoctiZakladniSazbu(): BigDecimal</code>, <code>ziskejTypVozidla(): String</code> a <code>jeNadLimitNosnosti(aktualniZatizeniKg: double): boolean</code> a soukromou pomocnou operaci (<code>-</code>) <code>overZatizeni(zatizeniKg: double): boolean</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Zachovejte všech 6 dosavadních tříd a 6 vazeb z kroku 2.3, přidejte z palety konkrétní podtřídy <code>OsobniAuto</code> a <code>Dodavka</code> a napojte je na abstraktní nadtřídu <code>Vozidlo</code> pomocí <strong>dvou vazeb generalizace</strong> (plná čára s prázdným trojúhelníkem směřujícím k <code>Vozidlo</code>, bez multiplicit a rolí): <code>OsobniAuto</code> dědí z <code>Vozidlo</code> a <code>Dodavka</code> dědí z <code>Vozidlo</code>.</p>
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
  // Krok 1 (3.1): Základní třídy, zapouzdření a asociace s multiplicitami
  // --------------------------------------------------------------------------
  {
    id: 'p-banka-01',
    order: 1,
    title: '3.1 Základní třídy, zapouzdření a asociace s multiplicitami',
    shortTitle: '3.1 Klient a Účet',
    storyIntro: 'Vstupuješ do bankovního domu! Nejdříve postavíme základní stavební kámen finančního systému: asociaci směřující od klienta k jeho bankovním účtům.',
    inheritPreviousCanvas: false,
    previousSubchapterId: null,
    assignmentTitle: 'Banka 1/4: Základní třídy, zapouzdření a asociace s multiplicitami',
    assignmentHtml: `
      <p><strong>Připravený model v paletě:</strong> Pro výchozí krok domény <strong>Banka</strong> máte v paletě připraveny dvě konkrétní návrhové třídy pro jazyk Java:</p>
      <ul>
        <li><strong>Klient</strong> obsahuje soukromé atributy (<code>-</code>) <code>klientId: String</code>, <code>jmeno: String</code>, <code>prijmeni: String</code>, <code>datumNarozeni: LocalDate</code>, <code>email: String</code> a soukromý referenční atribut <code>ucty: List&lt;BankovniUcet&gt;</code>. Poskytuje veřejné operace (<code>+</code>) <code>pridejUcet(ucet: BankovniUcet): void</code>, <code>ziskejCelkovyZustatek(): BigDecimal</code> a <code>aktualizujEmail(novyEmail: String): boolean</code>.</li>
        <li><strong>BankovniUcet</strong> (v tomto kroku zatím jako běžná konkrétní třída, nikoli abstraktní) obsahuje soukromé atributy (<code>-</code>) <code>cisloUctu: String</code>, <code>zustatek: BigDecimal</code>, <code>datumZalozeni: LocalDate</code> a <code>aktivni: boolean</code> a veřejné operace (<code>+</code>) <code>vloz(castka: BigDecimal): boolean</code>, <code>vyber(castka: BigDecimal): boolean</code>, <code>ziskejZustatek(): BigDecimal</code> a <code>zablokujUcet(): void</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Umístěte na plátno obě třídy (<code>Klient</code> a <code>BankovniUcet</code>) a propojte je <strong>asociací směřující z <code>Klient</code> na <code>BankovniUcet</code></strong> (šipka u <code>BankovniUcet</code>). Každý bankovní účet patří vždy právě jednomu klientovi (multiplicita <code>1</code> na straně <code>Klient</code>) a každý klient musí vlastnit alespoň jeden bankovní účet (multiplicita <code>1..*</code> a role <code>ucty</code> na straně <code>BankovniUcet</code>, odpovídající referenčnímu atributu <code>-ucty: List&lt;BankovniUcet&gt;</code> ve třídě <code>Klient</code>).</p>
    `,
    requirements: [
      'Umístěte na plátno konkrétní třídy <strong>Klient</strong> (včetně referenčního atributu <code>-ucty: List&lt;BankovniUcet&gt;</code>) a <strong>BankovniUcet</strong>.',
      'Propojte je <strong>asociací</strong> směřující z <code>Klient</code> na <code>BankovniUcet</code> (šipka u <code>BankovniUcet</code>).',
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
            wrongType: 'Mezi třídami Klient a BankovniUcet použij asociaci se šipkou u BankovniUcet, nikoli obousměrnou asociaci (<-->).',
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
  // Krok 2 (3.2): Řiditelnost asociací, role a referenční atributy
  // --------------------------------------------------------------------------
  {
    id: 'p-banka-02',
    order: 2,
    title: '3.2 Řiditelnost asociací, role a referenční atributy',
    shortTitle: '3.2 Transakce a Karta',
    storyIntro: 'Na plátno se přenesly tvé třídy z minulého kroku a BankovniUcet automaticky získal referenční atribut transakce i soukromou operaci pridejTransakci. Zapoj evidenci transakcí a platebních karet.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-banka-01',
    assignmentTitle: 'Banka 2/4: Řiditelnost asociací, role a referenční atributy',
    assignmentHtml: `
      <p><strong>Rozšíření modelu a nové třídy v paletě:</strong> Navazujete na svůj diagram z <strong>Podkapitoly 3.1</strong> (třídy <code>Klient</code> a <code>BankovniUcet</code> i jejich vazba zůstávají na plátně). Do stávající třídy <code>BankovniUcet</code> se automaticky promítl soukromý referenční atribut (<code>-</code>) <code>transakce: List&lt;Transakce&gt;</code> a soukromá operace <code>pridejTransakci(transakce: Transakce): void</code>. V paletě přibyly dvě nové konkrétní třídy:</p>
      <ul>
        <li><strong>Transakce</strong> obsahuje soukromé atributy (<code>-</code>) <code>transakceId: String</code>, <code>castka: BigDecimal</code>, <code>typTransakce: String</code>, <code>casProvedeni: LocalDateTime</code>, soukromý referenční atribut <code>pouzitaKarta: PlatebniKarta</code> a veřejné operace (<code>+</code>) <code>ziskejCastku(): BigDecimal</code>, <code>ziskejCasProvedeni(): LocalDateTime</code> a <code>jeKaretniTransakce(): boolean</code>.</li>
        <li><strong>PlatebniKarta</strong> obsahuje soukromé atributy (<code>-</code>) <code>cisloKarty: String</code>, <code>pinHash: String</code>, <code>datumExpirace: LocalDate</code>, <code>denniLimit: BigDecimal</code> a <code>zablokovana: boolean</code> a veřejné operace (<code>+</code>) <code>overPin(zadanyPin: String): boolean</code>, <code>zmenDenniLimit(novyLimit: BigDecimal): boolean</code>, <code>zablokujKartu(): void</code> a <code>jePlatna(aktualniDatum: LocalDate): boolean</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Zachovejte stávající třídy a vazbu <code>Klient → BankovniUcet</code>, přidejte z palety třídy <code>Transakce</code> a <code>PlatebniKarta</code> a vytvořte dvě nové asociace:</p>
      <ul>
        <li><strong>BankovniUcet → Transakce:</strong> Vytvořte asociaci (v tomto kroku zatím bez kosočtverce) směřující z <code>BankovniUcet</code> na <code>Transakce</code> (šipka u <code>Transakce</code>) s multiplicitou <code>1</code> na straně <code>BankovniUcet</code> a multiplicitou <code>0..*</code> a rolí <code>transakce</code> na straně <code>Transakce</code> (odpovídající referenčnímu atributu <code>-transakce: List&lt;Transakce&gt;</code>).</li>
        <li><strong>Transakce → PlatebniKarta:</strong> Vytvořte asociaci směřující z <code>Transakce</code> na <code>PlatebniKarta</code> (šipka u <code>PlatebniKarta</code>) s multiplicitou <code>0..*</code> na straně <code>Transakce</code> a multiplicitou <code>0..1</code> a rolí <code>pouzitaKarta</code> na straně <code>PlatebniKarta</code> (odpovídající referenčnímu atributu <code>-pouzitaKarta: PlatebniKarta</code>).</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající třídy <code>Klient</code>, <code>BankovniUcet</code> (aktualizovaný o <code>-transakce: List&lt;Transakce&gt;</code>) i jejich asociaci <code>Klient (1)</code> → <code>BankovniUcet (1..*, role: ucty)</code>.',
      'Přidejte z palety nové třídy <strong>Transakce</strong> (s referenčním atributem <code>-pouzitaKarta: PlatebniKarta</code>) a <strong>PlatebniKarta</strong>.',
      'Vytvořte asociaci <code>BankovniUcet (1)</code> → <code>Transakce (0..*, role: transakce)</code> (zatím bez kosočtverce).',
      'Vytvořte asociaci <code>Transakce (0..*)</code> → <code>PlatebniKarta (0..1, role: pouzitaKarta)</code>.'
    ],
    hints: [
      'V tomto kroku (3.2) je vazba BankovniUcet → Transakce záměrně ještě asociací bez kosočtverce; na kompozici ji zpřesníme v kroku 3.3. Cílové role transakce a pouzitaKarta odpovídají referenčním atributům ve zdrojových třídách.'
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
            wrongType: 'V tomto kroku (3.2) modeluj vazbu BankovniUcet → Transakce zatím jako asociaci bez kosočtverce.',
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
  // Krok 3 (3.3): Vazby celek–část (agregace a kompozice)
  // --------------------------------------------------------------------------
  {
    id: 'p-banka-03',
    order: 3,
    title: '3.3 Vazby celek–část (agregace a kompozice)',
    shortTitle: '3.3 Banka, Pobočka a kompozice',
    storyIntro: 'Je čas přidat organizační páteř banky! Doplň třídy Banka a Pobocka, rozliš životní cyklus poboček a klientů a zpřesni vazbu účtu k transakcím na kompozici.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-banka-02',
    assignmentTitle: 'Banka 3/4: Vazby celek–část (agregace a kompozice)',
    assignmentHtml: `
      <p><strong>Připravené třídy v paletě:</strong> Navazujete na svůj diagram z <strong>Podkapitoly 3.2</strong>. V paletě jsou nově připraveny dvě konkrétní třídy organizační struktury banky:</p>
      <ul>
        <li><strong>Banka</strong> obsahuje soukromé atributy (<code>-</code>) <code>nazev: String</code>, <code>kodBanky: String</code>, <code>swiftKod: String</code>, soukromý referenční atribut <code>pobocky: List&lt;Pobocka&gt;</code> a veřejné operace (<code>+</code>) <code>pridejPobocku(pobocka: Pobocka): void</code>, <code>najdiPobocku(kodPobocky: String): Pobocka</code> a <code>ziskejPocetPobocek(): int</code>.</li>
        <li><strong>Pobocka</strong> obsahuje soukromé atributy (<code>-</code>) <code>kodPobocky: String</code>, <code>adresa: String</code>, <code>mesto: String</code>, soukromý referenční atribut <code>kmenoviKlienti: List&lt;Klient&gt;</code> a veřejné operace (<code>+</code>) <code>priradKlienta(klient: Klient): void</code>, <code>odeberKlienta(klientId: String): boolean</code> a <code>najdiKlienta(klientId: String): Klient</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Zachovejte všechny dosavadní třídy a vazby z kroku 3.2, přidejte z palety třídy <code>Banka</code> a <code>Pobocka</code> a vytvořte či upravte následující vazby typu celek–část:</p>
      <ul>
        <li><strong>Kompozice Banka ◆→ Pobocka:</strong> Pobočka je existenčně závislou součástí banky a zaniká společně s ní. Vytvořte <strong>kompozici</strong> z celku <code>Banka</code> (plný kosočtverec u <code>Banka</code>) k části <code>Pobocka</code> (šipka u <code>Pobocka</code>) s multiplicitou <code>1</code> na straně <code>Banka</code> a multiplicitou <code>1..*</code> a rolí <code>pobocky</code> na straně <code>Pobocka</code> (odpovídající atributu <code>-pobocky: List&lt;Pobocka&gt;</code>).</li>
        <li><strong>Agregace Pobocka ◇→ Klient:</strong> Pobočka sdružuje své kmenové klienty s nezávislým životním cyklem (při zrušení pobočky klienti nezanikají). Vytvořte <strong>agregaci</strong> z celku <code>Pobocka</code> (prázdný kosočtverec u <code>Pobocka</code>) k části <code>Klient</code> (šipka u <code>Klient</code>) s multiplicitou <code>0..1</code> na straně <code>Pobocka</code> a multiplicitou <code>0..*</code> a rolí <code>kmenoviKlienti</code> na straně <code>Klient</code> (odpovídající atributu <code>-kmenoviKlienti: List&lt;Klient&gt;</code>).</li>
        <li><strong>Zpřesnění stávající vazby BankovniUcet → Transakce:</strong> Transakční záznamy jsou nedílnou součástí účtu a při jeho zrušení zanikají s ním. Klikněte na tuto stávající vazbu a změňte její typ z asociace na <strong>kompozici</strong> (plný kosočtverec na straně <code>BankovniUcet</code>); směr šipky k <code>Transakce</code>, multiplicity (<code>1</code> a <code>0..*</code>) i roli <code>transakce</code> ponechte beze změny.</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající 4 třídy z kroku 3.2 i vazby <code>Klient → BankovniUcet</code> a <code>Transakce → PlatebniKarta</code>.',
      'Přidejte z palety nové třídy <strong>Banka</strong> (s referenčním atributem <code>-pobocky: List&lt;Pobocka&gt;</code>) a <strong>Pobocka</strong> (s referenčním atributem <code>-kmenoviKlienti: List&lt;Klient&gt;</code>).',
      'Vytvořte <strong>kompozici</strong> <code>Banka (1)</code> ◆→ <code>Pobocka (1..*, role: pobocky)</code>.',
      'Vytvořte <strong>agregaci</strong> <code>Pobocka (0..1)</code> ◇→ <code>Klient (0..*, role: kmenoviKlienti)</code>.',
      'Klikněte na existující vazbu <code>BankovniUcet → Transakce</code> a změňte její typ na <strong>kompozici</strong> (plný kosočtverec u <code>BankovniUcet</code>).'
    ],
    hints: [
      'Nezapomeňte kliknout na stávající vazbu BankovniUcet → Transakce a přepnout ji z asociace na kompozici (◆──>).'
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
            wrongType: 'Vazba mezi třídami Banka a Pobocka má nastavený jiný typ, ale pobočka nemůže existovat bez banky – použij kompozici (plný kosočtverec).',
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
            wrongType: 'Při zrušení pobočky klienti nezanikají (mají nezávislý životní cyklus) – mezi Pobocka a Klient použij agregaci (prázdný kosočtverec).',
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
            wrongType: 'Stávající vazbu BankovniUcet → Transakce je v kroku 3.3 nutné zpřesnit z asociace na kompozici (plný kosočtverec u BankovniUcet).',
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
  // Krok 4 (3.4): Generalizace, abstraktní třída a finální podoba diagramu
  // --------------------------------------------------------------------------
  {
    id: 'p-banka-04',
    order: 4,
    title: '3.4 Generalizace, abstraktní třída a finální podoba diagramu',
    shortTitle: '3.4 Hierarchie účtů a karta',
    storyIntro: 'Poslední krok bankovní architektury! BankovniUcet se automaticky proměnil v abstraktní nadtřídu s chráněnými prvky (#). Připoj konkrétní podtřídy BeznyUcet a SporiciUcet a napoj vydávání platební karty k běžnému účtu.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-banka-03',
    assignmentTitle: 'Banka 4/4: Generalizace, abstraktní třída a finální podoba diagramu',
    assignmentHtml: `
      <p><strong>Refaktoring modelu a nové podtřídy v paletě:</strong> Navazujete na svůj diagram z <strong>Podkapitoly 3.3</strong>. Třída <code>BankovniUcet</code> na plátně byla automaticky převedena na <strong>abstraktní nadtřídu</strong> (<code>abstract</code>): atributy <code>zustatek</code> a <code>aktivni</code> i pomocná operace <code>pridejTransakci</code> získaly chráněnou viditelnost (<code>#</code>) pro potomky a veřejná operace <code>+vyber(castka: BigDecimal): boolean</code> je nyní abstraktní (<code>{abstract}</code>). V paletě jsou nově připraveny dvě konkrétní specializace účtů:</p>
      <ul>
        <li><strong>BeznyUcet</strong> obsahuje soukromé atributy (<code>-</code>) <code>kontokorentLimit: BigDecimal</code>, <code>mesicniPoplatek: BigDecimal</code>, soukromý referenční atribut <code>platebniKarta: PlatebniKarta</code>, veřejné operace (<code>+</code>) <code>vyber(castka: BigDecimal): boolean</code>, <code>vyberKartou(castka: BigDecimal, pin: String): boolean</code>, <code>nastavKontokorent(novyLimit: BigDecimal): boolean</code> a <code>vystavKartu(cisloKarty: String, pinHash: String, denniLimit: BigDecimal): PlatebniKarta</code> a soukromou pomocnou operaci (<code>-</code>) <code>overDostupnyZustatek(castka: BigDecimal): boolean</code>.</li>
        <li><strong>SporiciUcet</strong> obsahuje soukromé atributy (<code>-</code>) <code>urokovaSazba: double</code> a <code>minimalniZustatek: BigDecimal</code> a veřejné operace (<code>+</code>) <code>vyber(castka: BigDecimal): boolean</code>, <code>pripisUrok(): BigDecimal</code> a <code>zmenUrokovouSazbu(novaSazba: double): void</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Zachovejte všech 6 dosavadních tříd a všech 5 vazeb z kroku 3.3, přidejte z palety konkrétní podtřídy <code>BeznyUcet</code> a <code>SporiciUcet</code> a vytvořte tři nové vazby:</p>
      <ul>
        <li><strong>Dvě vazby generalizace:</strong> Napojte obě nové podtřídy na abstraktní nadtřídu <code>BankovniUcet</code> (plná čára s prázdným trojúhelníkem směřujícím k <code>BankovniUcet</code>, bez multiplicit a rolí): <code>BeznyUcet</code> dědí z <code>BankovniUcet</code> a <code>SporiciUcet</code> dědí z <code>BankovniUcet</code>.</li>
        <li><strong>Kompozice BeznyUcet ◆→ PlatebniKarta:</strong> Platební kartu lze vydat výhradně k běžnému účtu, na němž je existenčně závislá a při jeho zrušení zaniká. Vytvořte <strong>kompozici</strong> z celku <code>BeznyUcet</code> (plný kosočtverec u <code>BeznyUcet</code>) k části <code>PlatebniKarta</code> (šipka u <code>PlatebniKarta</code>) s multiplicitou <code>1</code> na straně <code>BeznyUcet</code> a multiplicitou <code>0..1</code> a rolí <code>platebniKarta</code> na straně <code>PlatebniKarta</code> (odpovídající referenčnímu atributu <code>-platebniKarta: PlatebniKarta</code> ve třídě <code>BeznyUcet</code>).</li>
      </ul>
    `,
    requirements: [
      'Zachovejte všech 6 dosavadních tříd (včetně aktualizované abstraktní třídy <code>BankovniUcet</code>) a všech 5 vazeb z kroku 3.3.',
      'Přidejte z palety konkrétní podtřídy <strong>BeznyUcet</strong> (s referenčním atributem <code>-platebniKarta: PlatebniKarta</code>) a <strong>SporiciUcet</strong>.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>BeznyUcet</code> (potomek) k <code>BankovniUcet</code> (rodič) bez multiplicit a rolí.',
      'Vytvořte vazbu <strong>generalizace</strong> od <code>SporiciUcet</code> (potomek) k <code>BankovniUcet</code> (rodič) bez multiplicit a rolí.',
      'Vytvořte <strong>kompozici</strong> <code>BeznyUcet (1)</code> ◆→ <code>PlatebniKarta (0..1, role: platebniKarta)</code>.'
    ],
    hints: [
      'Nezapomeňte kromě obou generalizací doplnit také kompozici BeznyUcet (1) ◆→ PlatebniKarta (0..1, role platebniKarta odpovídající atributu -platebniKarta: PlatebniKarta).'
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
            wrongType: 'Platební karta je existenčně vázána na běžný účet – mezi BeznyUcet a PlatebniKarta použij kompozici (plný kosočtverec u BeznyUcet).',
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
  // Krok 1 (4.1): Základní třídy, zapouzdření a asociace s multiplicitami
  // --------------------------------------------------------------------------
  {
    id: 'p-geo-01',
    order: 1,
    title: '4.1 Základní třídy, zapouzdření a asociace s multiplicitami',
    shortTitle: '4.1 Tvar a Styl',
    storyIntro: 'Vítej v ateliéru vektorové grafiky! Nejprve založíme jádro grafického editoru: propojíme geometrický tvar s jeho vizuálním stylem pomocí asociace se šipkou.',
    inheritPreviousCanvas: false,
    previousSubchapterId: null,
    assignmentTitle: 'Geometrie 1/4: Základní třídy, zapouzdření a asociace s multiplicitami',
    assignmentHtml: `
      <p><strong>Připravený model v paletě:</strong> Pro výchozí krok domény <strong>Geometrie (Malování)</strong> máte v paletě připraveny dvě konkrétní návrhové třídy pro jazyk Java:</p>
      <ul>
        <li><strong>Tvar</strong> (v tomto kroku zatím jako běžná konkrétní třída, nikoli abstraktní) obsahuje soukromé atributy (<code>-</code>) <code>tvarId: String</code>, <code>rotaceStupne: double</code>, <code>viditelny: boolean</code>, soukromý referenční atribut <code>styl: Styl</code>, veřejné operace (<code>+</code>) <code>vypoctiObsah(): double</code>, <code>vypoctiObvod(): double</code>, <code>vykresli(): void</code>, <code>posun(dx: double, dy: double): void</code>, <code>otoc(uhelStupne: double): void</code> a <code>priradStyl(styl: Styl): void</code> a soukromou pomocnou operaci (<code>-</code>) <code>normalizujUhel(uhel: double): double</code>.</li>
        <li><strong>Styl</strong> obsahuje soukromé atributy (<code>-</code>) <code>stylId: String</code>, <code>barvaVyplne: String</code>, <code>barvaObrysu: String</code>, <code>tloustkaObrysu: double</code> a <code>pruhlednost: double</code>, veřejné operace (<code>+</code>) <code>zmenBarvuVyplne(hexBarva: String): boolean</code>, <code>zmenBarvuObrysu(hexBarva: String): boolean</code> a <code>nastavTloustkuObrysu(tloustka: double): boolean</code> a soukromou validační operaci (<code>-</code>) <code>jePlatnaHexBarva(hexBarva: String): boolean</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Umístěte na plátno obě třídy (<code>Tvar</code> a <code>Styl</code>) a propojte je <strong>asociací směřující z <code>Tvar</code> na <code>Styl</code></strong> (šipka u <code>Styl</code>). Jeden styl může používat libovolný počet tvarů nebo žádný (multiplicita <code>0..*</code> na straně <code>Tvar</code>) a každý tvar může mít přiřazen nejvýše jeden styl nebo žádný (multiplicita <code>0..1</code> a role <code>styl</code> na straně <code>Styl</code>, odpovídající referenčnímu atributu <code>-styl: Styl</code> ve třídě <code>Tvar</code>).</p>
    `,
    requirements: [
      'Umístěte na plátno konkrétní třídy <strong>Tvar</strong> (včetně referenčního atributu <code>-styl: Styl</code>) a <strong>Styl</strong>.',
      'Propojte je <strong>asociací</strong> směřující z <code>Tvar</code> na <code>Styl</code> (šipka u <code>Styl</code>).',
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
            wrongType: 'Mezi třídami Tvar a Styl použij asociaci se šipkou u Styl, nikoli obousměrnou asociaci (<-->).',
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
  // Krok 2 (4.2): Řiditelnost asociací, role a referenční atributy
  // --------------------------------------------------------------------------
  {
    id: 'p-geo-02',
    order: 2,
    title: '4.2 Řiditelnost asociací, role a referenční atributy',
    shortTitle: '4.2 Plátno a Kotevní bod',
    storyIntro: 'Skvěle! Třída Tvar automaticky získala referenční atribut kotevniBod – teď na plátno doplníme pracovní Platno a souřadnicový Bod a propojíme je řiditelnými asociacemi.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-geo-01',
    assignmentTitle: 'Geometrie 2/4: Řiditelnost asociací, role a referenční atributy',
    assignmentHtml: `
      <p><strong>Rozšíření modelu a nové třídy v paletě:</strong> Navazujete na svůj diagram z <strong>Podkapitoly 4.1</strong> (třídy <code>Tvar</code> a <code>Styl</code> i jejich vazba zůstávají na plátně). Do stávající třídy <code>Tvar</code> se automaticky promítl soukromý referenční atribut (<code>-</code>) <code>kotevniBod: Bod</code>. V paletě přibyly dvě nové konkrétní třídy:</p>
      <ul>
        <li><strong>Platno</strong> (základní rozsah před zavedením vrstev) obsahuje soukromé atributy (<code>-</code>) <code>nazev: String</code>, <code>sirkaPx: int</code>, <code>vyskaPx: int</code>, <code>barvaPozadi: String</code>, soukromý referenční atribut <code>oznacenyTvar: Tvar</code> a veřejné operace (<code>+</code>) <code>oznacTvar(tvar: Tvar): void</code>, <code>zrusOznaceni(): void</code> a <code>vykresli(): void</code>.</li>
        <li><strong>Bod</strong> obsahuje soukromé atributy (<code>-</code>) <code>x: double</code> a <code>y: double</code> a veřejné operace (<code>+</code>) <code>posunO(dx: double, dy: double): void</code>, <code>vzdalenostOd(cilovyBod: Bod): double</code>, <code>ziskejX(): double</code> a <code>ziskejY(): double</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Zachovejte stávající třídy a vazbu <code>Tvar → Styl</code>, přidejte z palety třídy <code>Platno</code> a <code>Bod</code> a vytvořte dvě nové asociace:</p>
      <ul>
        <li><strong>Platno → Tvar:</strong> Vytvořte asociaci směřující z <code>Platno</code> na <code>Tvar</code> (šipka u <code>Tvar</code>) s multiplicitou <code>0..1</code> na straně <code>Platno</code> a multiplicitou <code>0..1</code> a rolí <code>oznacenyTvar</code> na straně <code>Tvar</code> (odpovídající referenčnímu atributu <code>-oznacenyTvar: Tvar</code>).</li>
        <li><strong>Tvar → Bod:</strong> Vytvořte asociaci (v tomto kroku zatím bez kosočtverce) směřující z <code>Tvar</code> na <code>Bod</code> (šipka u <code>Bod</code>) s multiplicitou <code>1</code> na straně <code>Tvar</code> a multiplicitou <code>1</code> a rolí <code>kotevniBod</code> na straně <code>Bod</code> (odpovídající referenčnímu atributu <code>-kotevniBod: Bod</code>).</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající třídy <code>Tvar</code> (aktualizovaný o <code>-kotevniBod: Bod</code>), <code>Styl</code> i jejich asociaci <code>Tvar (0..*)</code> → <code>Styl (0..1, role: styl)</code>.',
      'Přidejte z palety nové třídy <strong>Platno</strong> (s referenčním atributem <code>-oznacenyTvar: Tvar</code>) a <strong>Bod</strong>.',
      'Vytvořte asociaci <code>Platno (0..1)</code> → <code>Tvar (0..1, role: oznacenyTvar)</code>.',
      'Vytvořte asociaci <code>Tvar (1)</code> → <code>Bod (1, role: kotevniBod)</code> (zatím bez kosočtverce).'
    ],
    hints: [
      'V tomto kroku (4.2) je vazba Tvar → Bod záměrně ještě asociací bez kosočtverce; na kompozici ji změníme v kroku 4.3. Cílové role oznacenyTvar a kotevniBod odpovídají referenčním atributům ve zdrojových třídách.'
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
            wrongType: 'V tomto kroku (4.2) modeluj vazbu Tvar → Bod zatím jako asociaci bez kosočtverce.',
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
  // Krok 3 (4.3): Vazby celek–část (agregace a kompozice)
  // --------------------------------------------------------------------------
  {
    id: 'p-geo-03',
    order: 3,
    title: '4.3 Vazby celek–část (agregace a kompozice)',
    shortTitle: '4.3 Vrstvy, Paleta a kompozice',
    storyIntro: 'Třída Platno automaticky získala referenční atribut vrstvy i operace pro správu vrstev. Teď model obohať o Vrstvu, Paletu, silné kompozice (včetně zpřesnění vazby k Bodu) a slabou agregaci palety stylů.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-geo-02',
    assignmentTitle: 'Geometrie 3/4: Vazby celek–část (agregace a kompozice)',
    assignmentHtml: `
      <p><strong>Rozšíření modelu a nové třídy v paletě:</strong> Navazujete na svůj diagram z <strong>Podkapitoly 4.2</strong>. Do stávající třídy <code>Platno</code> se automaticky promítl soukromý referenční atribut (<code>-</code>) <code>vrstvy: List&lt;Vrstva&gt;</code> a veřejné operace <code>pridejVrstvu(vrstva: Vrstva): void</code> a <code>odeberVrstvu(vrstvaId: String): boolean</code>. V paletě jsou nově připraveny dvě konkrétní třídy:</p>
      <ul>
        <li><strong>Vrstva</strong> obsahuje soukromé atributy (<code>-</code>) <code>vrstvaId: String</code>, <code>nazev: String</code>, <code>poradiZ: int</code>, <code>viditelna: boolean</code>, <code>zamcena: boolean</code>, soukromý referenční atribut <code>tvary: List&lt;Tvar&gt;</code> a veřejné operace (<code>+</code>) <code>pridejTvar(tvar: Tvar): boolean</code>, <code>odeberTvar(tvarId: String): boolean</code>, <code>najdiTvar(tvarId: String): Tvar</code>, <code>nastavViditelnost(viditelna: boolean): void</code> a <code>ziskejPocetTvaru(): int</code>.</li>
        <li><strong>Paleta</strong> obsahuje soukromé atributy (<code>-</code>) <code>nazev: String</code>, <code>popis: String</code>, soukromý referenční atribut <code>styly: List&lt;Styl&gt;</code> a veřejné operace (<code>+</code>) <code>pridejStyl(styl: Styl): void</code>, <code>odeberStyl(stylId: String): boolean</code>, <code>najdiStyl(stylId: String): Styl</code> a <code>ziskejPocetStylu(): int</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Zachovejte všechny dosavadní třídy a vazby z kroku 4.2, přidejte z palety třídy <code>Vrstva</code> a <code>Paleta</code> a vytvořte či upravte následující vazby typu celek–část:</p>
      <ul>
        <li><strong>Kompozice Platno ◆→ Vrstva:</strong> Vrstva je existenčně závislou součástí plátna a při jeho odstranění zaniká. Vytvořte <strong>kompozici</strong> z celku <code>Platno</code> (plný kosočtverec u <code>Platno</code>) k části <code>Vrstva</code> (šipka u <code>Vrstva</code>) s multiplicitou <code>1</code> na straně <code>Platno</code> a multiplicitou <code>1..*</code> a rolí <code>vrstvy</code> na straně <code>Vrstva</code> (odpovídající atributu <code>-vrstvy: List&lt;Vrstva&gt;</code>).</li>
        <li><strong>Kompozice Vrstva ◆→ Tvar:</strong> Nakreslené tvary jsou existenčně svázány se svou vrstvou a při jejím smazání zanikají. Vytvořte <strong>kompozici</strong> z celku <code>Vrstva</code> (plný kosočtverec u <code>Vrstva</code>) k části <code>Tvar</code> (šipka u <code>Tvar</code>) s multiplicitou <code>1</code> na straně <code>Vrstva</code> a multiplicitou <code>0..*</code> a rolí <code>tvary</code> na straně <code>Tvar</code> (odpovídající atributu <code>-tvary: List&lt;Tvar&gt;</code>).</li>
        <li><strong>Zpřesnění stávající vazby Tvar → Bod:</strong> Kotevní bod je neoddělitelnou součástí tvaru a zaniká společně s ním. Klikněte na tuto stávající vazbu a změňte její typ z asociace na <strong>kompozici</strong> (plný kosočtverec na straně <code>Tvar</code>); směr šipky k <code>Bod</code>, multiplicity (<code>1</code> a <code>1</code>) i roli <code>kotevniBod</code> ponechte beze změny.</li>
        <li><strong>Agregace Paleta ◇→ Styl:</strong> Paleta sdružuje styly s nezávislým životním cyklem (při smazání palety styly v systému nadále existují). Vytvořte <strong>agregaci</strong> z celku <code>Paleta</code> (prázdný kosočtverec u <code>Paleta</code>) k části <code>Styl</code> (šipka u <code>Styl</code>) s multiplicitou <code>0..1</code> na straně <code>Paleta</code> a multiplicitou <code>0..*</code> a rolí <code>styly</code> na straně <code>Styl</code> (odpovídající atributu <code>-styly: List&lt;Styl&gt;</code>).</li>
      </ul>
    `,
    requirements: [
      'Zachovejte stávající 4 třídy z kroku 4.2 i vazby <code>Platno → Tvar</code> a <code>Tvar → Styl</code>.',
      'Přidejte z palety nové třídy <strong>Vrstva</strong> (s referenčním atributem <code>-tvary: List&lt;Tvar&gt;</code>) a <strong>Paleta</strong> (s referenčním atributem <code>-styly: List&lt;Styl&gt;</code>).',
      'Vytvořte <strong>kompozici</strong> <code>Platno (1)</code> ◆→ <code>Vrstva (1..*, role: vrstvy)</code>.',
      'Vytvořte <strong>kompozici</strong> <code>Vrstva (1)</code> ◆→ <code>Tvar (0..*, role: tvary)</code>.',
      'Klikněte na stávající vazbu <code>Tvar → Bod</code> a přepněte ji na <strong>kompozici</strong> (plný kosočtverec u <code>Tvar</code>).',
      'Vytvořte <strong>agregaci</strong> <code>Paleta (0..1)</code> ◇→ <code>Styl (0..*, role: styly)</code>.'
    ],
    hints: [
      'Nezapomeňte upravit existující vazbu Tvar → Bod na kompozici (◆──>) a ponechat původní vazbu Platno → Tvar (role oznacenyTvar) jako asociaci.'
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
            wrongType: 'Vrstva nemůže existovat bez plátna – mezi Platno a Vrstva použij kompozici (plný kosočtverec u Platno).',
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
            wrongType: 'Tvary jsou existenčně svázány se svou vrstvou – mezi Vrstva a Tvar použij kompozici (plný kosočtverec u Vrstva).',
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
            wrongType: 'Stávající vazbu Tvar → Bod je v kroku 4.3 nutné zpřesnit z asociace na kompozici (plný kosočtverec u Tvar).',
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
            wrongType: 'Při smazání palety styly nadále existují (nezávislý životní cyklus) – mezi Paleta a Styl použij agregaci (prázdný kosočtverec u Paleta).',
            wrongSourceMultiplicity: 'U agregace Paleta ◇→ Styl uveď na straně Paleta multiplicitu „0..1“ (styl může existovat i mimo paletu).',
            wrongTargetRole: 'U agregace Paleta ◇→ Styl uveď na straně Styl roli „styly“ odpovídající referenčnímu atributu -styly: List<Styl>.'
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // Krok 4 (4.4): Generalizace, abstraktní třída a finální podoba diagramu
  // --------------------------------------------------------------------------
  {
    id: 'p-geo-04',
    order: 4,
    title: '4.4 Generalizace, abstraktní třída a finální podoba diagramu',
    shortTitle: '4.4 Abstraktní Tvar a podtřídy',
    storyIntro: 'Závěrečný tah štětcem! Třída Tvar se automaticky proměnila v abstraktní nadtřídu s chráněnými členy (#) a abstraktními metodami – napoj k ní konkrétní tvary Kruh a Obdelnik.',
    inheritPreviousCanvas: true,
    previousSubchapterId: 'p-geo-03',
    assignmentTitle: 'Geometrie 4/4: Generalizace, abstraktní třída a finální podoba diagramu',
    assignmentHtml: `
      <p><strong>Refaktoring modelu a nové podtřídy v paletě:</strong> Navazujete na svůj diagram z <strong>Podkapitoly 4.3</strong>. Třída <code>Tvar</code> na plátně byla automaticky převedena na <strong>abstraktní nadtřídu</strong> (<code>abstract</code>): atributy <code>rotaceStupne</code> a <code>viditelny</code> i pomocná operace <code>normalizujUhel</code> získaly chráněnou viditelnost (<code>#</code>) pro potomky a bezparametrické operace <code>+vypoctiObsah(): double</code>, <code>+vypoctiObvod(): double</code> a <code>+vykresli(): void</code> jsou nyní abstraktní (<code>{abstract}</code>). V paletě jsou nově připraveny dvě konkrétní geometrické specializace:</p>
      <ul>
        <li><strong>Kruh</strong> obsahuje soukromý atribut (<code>-</code>) <code>polomer: double</code> a veřejné operace (<code>+</code>) <code>vypoctiObsah(): double</code>, <code>vypoctiObvod(): double</code>, <code>vykresli(): void</code>, <code>zmenPolomer(novyPolomer: double): boolean</code> a <code>obsahujeBod(bod: Bod): boolean</code>.</li>
        <li><strong>Obdelnik</strong> obsahuje soukromé atributy (<code>-</code>) <code>sirka: double</code>, <code>vyska: double</code> a <code>zaobleniRohu: double</code>, veřejné operace (<code>+</code>) <code>vypoctiObsah(): double</code>, <code>vypoctiObvod(): double</code>, <code>vykresli(): void</code>, <code>zmenRozmery(novaSirka: double, novaVyska: double): boolean</code> a <code>jeCtverec(): boolean</code> a soukromou pomocnou operaci (<code>-</code>) <code>overRozmery(sirka: double, vyska: double): boolean</code>.</li>
      </ul>
      <p><strong>Váš úkol na plátně:</strong> Zachovejte všech 6 dosavadních tříd a všech 6 vazeb z kroku 4.3, přidejte z palety konkrétní podtřídy <code>Kruh</code> a <code>Obdelnik</code> a napojte je na abstraktní nadtřídu <code>Tvar</code> pomocí <strong>dvou vazeb generalizace</strong> (plná čára s prázdným trojúhelníkem směřujícím k <code>Tvar</code>, bez multiplicit a rolí): <code>Kruh</code> dědí z <code>Tvar</code> a <code>Obdelnik</code> dědí z <code>Tvar</code>.</p>
    `,
    requirements: [
      'Zachovejte všech 6 dosavadních tříd (včetně aktualizované abstraktní třídy <code>Tvar</code>) a všech 6 vazeb z kroku 4.3.',
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
