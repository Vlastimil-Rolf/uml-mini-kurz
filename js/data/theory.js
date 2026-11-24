/**
 * Datový modul teoretické části: 1 kapitola ('teorie') se 7 podkapitolami ('t1' až 't7').
 * V každé podkapitole používá výklad s ukázkovým diagramem jinou doménu než samostatné zadání,
 * přičemž napříč kapitolou jsou rovnoměrně zastoupeny všechny tři domény (Autoservis, Banka, Geometrie).
 *
 * Struktura zahrnuje jak přesná pole schématu (id, title, storyIntro, theoryHtml, exampleDiagram,
 * assignmentHtml, classes, validationRules), tak aliasy pro přímé napojení na app.js, editor.js a validator.js.
 */

function normalizeTheorySubchapter(rawSub) {
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
    theoryHtml: rawSub.theoryHtml,
    exampleDiagram: rawSub.exampleDiagram,
    assignmentHtml: rawSub.assignmentHtml,
    classes: normalizedClasses,
    validationRules: rawSub.validationRules,

    // Metadata a aliasy pro přímou kompatibilitu se stávajícími moduly aplikace
    chapterId: 'teorie',
    type: 'theory',
    order: rawSub.order,
    shortTitle: rawSub.shortTitle,
    maxXp: 100,
    inheritPreviousCanvas: false,
    previousSubchapterId: null,
    masterIntro: rawSub.storyIntro,
    theoryContent: {
      html: rawSub.theoryHtml,
      staticDiagram: rawSub.exampleDiagram
    },
    assignment: {
      title: `Dokonalé zadání: ${rawSub.title}`,
      descriptionHtml: rawSub.assignmentHtml,
      requirements: rawSub.requirements || [],
      hints: rawSub.hints || []
    },
    paletteClasses: normalizedClasses,
    expectedClasses: rawSub.validationRules.expectedClasses,
    expectedRelations: rawSub.validationRules.expectedRelations
  };
}

const RAW_THEORY_SUBCHAPTERS = [
  // =========================================================================
  // t1: Třída, atributy, metody a viditelnost (+, -, #)
  // Výklad + ukázka: Banka | Zadání + validace: Autoservis
  // =========================================================================
  {
    id: 't1',
    order: 1,
    title: '1.1 Třída, atributy, metody a viditelnost (+, -, #)',
    shortTitle: '1.1 Třída a viditelnost',
    storyIntro: 'Začneme u základního kamene objektového návrhu: jak zapsat návrhovou třídu pro jazyk Java a uchránit její vnitřní stav pomocí modifikátorů viditelnosti.',
    theoryHtml: `
      <h4>Co to je a k čemu to slouží</h4>
      <p><strong>Třída</strong> je základním stavebním kamenem objektově orientovaného návrhu a představuje šablonu (předpis) pro vytváření konkrétních objektů (instancí), které sdílejí stejnou strukturu dat a chování. Zatímco v analytickém modelu třída zachycuje pouze obecné pojmy z reálného světa (např. „Účet má číslo a zůstatek“), v <strong>návrhovém diagramu tříd (Design Class Diagram)</strong> představuje přímý technický podklad pro implementaci v konkrétním programovacím jazyce (zde v jazyce Java).</p>
      <p>Návrhová třída definuje:</p>
      <ul>
        <li><strong>Atributy (členské proměnné):</strong> Konkrétní datovou reprezentaci stavu objektu včetně přesných implementačních datových typů.</li>
        <li><strong>Metody (operace):</strong> Konkrétní rozhraní a chování, které objekt poskytuje svému okolí nebo využívá pro svou vnitřní logiku.</li>
        <li><strong>Zapouzdření (viditelnost):</strong> Řízení přístupu k vnitřním datům a operacím třídy. Zapouzdření chrání integritu vnitřního stavu objektu (např. znemožňuje přímé přepsání zůstatku účtu zvenčí bez ověření) a odděluje veřejný kontrakt třídy od její interní implementace.</li>
      </ul>

      <h4>Jak se to zapisuje v UML</h4>
      <p>Třída se v <strong>UML 2.5</strong> zakresluje jako obdélník rozdělený vodorovnými čarami do tří sekcí:</p>
      <ul>
        <li><strong>Hlavička (horní sekce):</strong> Obsahuje název třídy psaný tučně, zarovnaný na střed, v konvenci <code>PascalCase</code> (např. <code>BankovniUcet</code>).</li>
        <li><strong>Sekce atributů (prostřední sekce):</strong> Každý atribut se zapisuje na samostatný řádek ve formátu <code>[viditelnost] nazevAtributu: DatovyTyp</code> (např. <code>-cisloUctu: String</code>).</li>
        <li><strong>Sekce metod (spodní sekce):</strong> Každá operace se zapisuje na samostatný řádek ve formátu <code>[viditelnost] nazevMetody(parametr1: Typ1, parametr2: Typ2): NavratovyTyp</code> (např. <code>+vloz(castka: BigDecimal): boolean</code>). Operace, které nevracejí žádnou hodnotu, mají uveden návratový typ <code>void</code>.</li>
      </ul>
      <p>Modifikátory viditelnosti v UML:</p>
      <ul>
        <li><code>+</code> (<strong>public – veřejná</strong>): Prvek je přístupný z jakékoli jiné třídy v systému. Používá se pro veřejné rozhraní (metody).</li>
        <li><code>-</code> (<strong>private – soukromá</strong>): Prvek je přístupný výhradně uvnitř samotné třídy, ve které je deklarován. Používá se pro většinu atributů a interní pomocné metody.</li>
        <li><code>#</code> (<strong>protected – chráněná</strong>): Prvek je přístupný uvnitř samotné třídy a v jejích přímých i nepřímých potomcích (podtřídách v dědičné hierarchii).</li>
      </ul>

      <h4>Na co si dát pozor (nejčastější chyby)</h4>
      <ul>
        <li><strong>Veřejné atributy (+):</strong> Ponechání atributů jako veřejných porušuje základní princip zapouzdření. Atributy by měly být standardně soukromé (<code>-</code>), případně chráněné (<code>#</code>), pokud s nimi mají přímo pracovat podtřídy.</li>
        <li><strong>Analytické nebo chybějící datové typy:</strong> V návrhovém diagramu nelze psát obecné pojmy jako <em>Text</em> nebo <em>Číslo</em> ani typy zcela vynechávat. Je nutné používat přesné typy cílového jazyka (např. <code>String</code>, <code>boolean</code>, <code>BigDecimal</code> pro přesné peněžní částky místo nepřesného <code>double</code>).</li>
        <li><strong>Chybějící návratový typ void:</strong> U metod, které nic nevracejí, studenti v návrhovém modelu často návratový typ vynechají; v Javě i v návrhovém UML je však nutné explicitně uvést <code>: void</code>.</li>
        <li><strong>Zanesení triviálních getterů, setterů a konstruktorů:</strong> Pokud to zadání výslovně nevyžaduje, návrhový diagram se nezahltí automaticky generovanými metodami typu <code>getCisloUctu()</code> nebo <code>setZablokovana()</code>, ale uvádí pouze doménově významné operace.</li>
      </ul>

      <h4>Komentovaný příklad</h4>
      <p>Diagram zachycuje dvě samostatné návrhové třídy bankovní domény připravené pro implementaci v Javě:</p>
      <ul>
        <li>Třída <code>BankovniUcet</code> má soukromý identifikátor <code>-cisloUctu: String</code> a chráněný atribut <code>#zustatek: BigDecimal</code> (připravený pro budoucí potomky účtu). Navenek nabízí dvě veřejné operace: <code>+vloz(castka: BigDecimal): boolean</code> pro vklad peněz s návratovým příznakem úspěchu a bezparametrickou operaci <code>+ziskejZustatek(): BigDecimal</code>.</li>
        <li>Třída <code>PlatebniKarta</code> zapouzdřuje všechny své atributy jako soukromé (<code>-cisloKarty: String</code>, <code>-zablokovana: boolean</code>) a definuje veřejné metody pro ověření PINu (<code>+overPin(zadanyPin: String): boolean</code>) a zablokování karty (<code>+zablokujKartu(): void</code>).</li>
      </ul>
    `,
    exampleDiagram: {
      caption: 'Ukázkový příklad (Banka): Dvě samostatné konkrétní návrhové třídy bez vazby',
      classes: [
        {
          id: 'ex-t1-ucet',
          name: 'BankovniUcet',
          stereotype: null,
          isAbstract: false,
          x: 20,
          y: 26,
          attributes: [
            { visibility: '-', name: 'cisloUctu', type: 'String', isStatic: false },
            { visibility: '#', name: 'zustatek', type: 'BigDecimal', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'vloz', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false },
            { visibility: '+', name: 'ziskejZustatek', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false }
          ]
        },
        {
          id: 'ex-t1-karta',
          name: 'PlatebniKarta',
          stereotype: null,
          isAbstract: false,
          x: 345,
          y: 26,
          attributes: [
            { visibility: '-', name: 'cisloKarty', type: 'String', isStatic: false },
            { visibility: '-', name: 'zablokovana', type: 'boolean', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'overPin', params: 'zadanyPin: String', returnType: 'boolean', isAbstract: false, isStatic: false },
            { visibility: '+', name: 'zablokujKartu', params: '', returnType: 'void', isAbstract: false, isStatic: false }
          ]
        }
      ],
      relations: []
    },
    assignmentHtml: `
      <p>Vytvořte návrhový diagram tříd (UML 2.5) pro jazyk Java obsahující <strong>přesně dvě samostatné konkrétní třídy bez jakékoli vazby mezi nimi</strong>. Nemodelujte konstruktory ani žádné další nespecifikované atributy či operace.</p>
      <p>Třída <strong>Vozidlo</strong> obsahuje soukromý atribut (<code>-</code>) <code>vin</code> typu <code>String</code> a chráněný atribut (<code>#</code>) <code>najeteKm</code> typu <code>int</code>. Nabízí veřejnou operaci (<code>+</code>) <code>aktualizujNajezd</code> s parametrem <code>noveKm</code> typu <code>int</code> vracející <code>boolean</code> a chráněnou pomocnou operaci (<code>#</code>) <code>overNajezd</code> s parametrem <code>noveKm</code> typu <code>int</code> vracející <code>boolean</code>.</p>
      <p>Třída <strong>Mechanik</strong> obsahuje dva soukromé atributy (<code>-</code>): <code>mechanikId</code> typu <code>String</code> a <code>dostupny</code> typu <code>boolean</code>. Nabízí veřejnou operaci (<code>+</code>) <code>nastavDostupnost</code> s parametrem <code>dostupny</code> typu <code>boolean</code> bez návratové hodnoty (<code>void</code>) a veřejnou bezparametrickou operaci (<code>+</code>) <code>jeDostupny</code> vracející <code>boolean</code>.</p>
      <p>Mezi třídami <strong>nevytvářejte žádnou asociační ani jinou vazbu</strong>.</p>
    `,
    requirements: [
      'Umístěte na plátno konkrétní třídy <strong>Vozidlo</strong> a <strong>Mechanik</strong>.',
      'Nevytvářejte mezi třídami žádnou asociační ani jinou vazbu (počet vazeb = 0).'
    ],
    hints: [
      'Přetáhněte obě třídy (Vozidlo a Mechanik) z palety na plátno, prohlédněte si modifikátory viditelnosti (+, -, #) a nepropojujte je žádnou vazbou.'
    ],
    classes: [
      {
        id: 't1-vozidlo',
        kind: 'class',
        name: 'Vozidlo',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'vin', type: 'String', isStatic: false },
          { visibility: '#', name: 'najeteKm', type: 'int', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'aktualizujNajezd', params: 'noveKm: int', returnType: 'boolean', isAbstract: false, isStatic: false },
          { visibility: '#', name: 'overNajezd', params: 'noveKm: int', returnType: 'boolean', isAbstract: false, isStatic: false }
        ]
      },
      {
        id: 't1-mechanik',
        kind: 'class',
        name: 'Mechanik',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'mechanikId', type: 'String', isStatic: false },
          { visibility: '-', name: 'dostupny', type: 'boolean', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'nastavDostupnost', params: 'dostupny: boolean', returnType: 'void', isAbstract: false, isStatic: false },
          { visibility: '+', name: 'jeDostupny', params: '', returnType: 'boolean', isAbstract: false, isStatic: false }
        ]
      }
    ],
    validationRules: {
      counts: { classifiers: 2, relations: 0 },
      expectedClasses: ['t1-vozidlo', 't1-mechanik'],
      expectedRelations: []
    }
  },

  // =========================================================================
  // t2: Jednoduchá asociace a násobnosti (kardinality)
  // Výklad + ukázka: Autoservis | Zadání + validace: Geometrie (Malování)
  // =========================================================================
  {
    id: 't2',
    order: 2,
    title: '1.2 Jednoduchá asociace a násobnosti (kardinality)',
    shortTitle: '1.2 Asociace a násobnosti',
    storyIntro: 'Samotné třídy ještě systém netvoří. Propoj je prostou obousměrnou asociací a pečlivě ověř násobnosti na obou koncích spojovací čáry.',
    theoryHtml: `
      <h4>Co to je a k čemu to slouží</h4>
      <p><strong>Jednoduchá (prostá) asociace</strong> vyjadřuje strukturální propojení mezi instancemi dvou tříd, které spolu v systému spolupracují, aniž by jedna třída byla strukturální součástí druhé (nejedná se o vztah celek–část). V návrhovém modelu asociace definuje, že instance jedné třídy drží v paměti odkaz (referenci nebo kolekci referencí) na instance druhé třídy.</p>
      <p><strong>Násobnost (kardinalita)</strong> určuje přesný počet instancí jedné třídy, které mohou být v daný okamžik propojeny s jednou instancí třídy druhé. Z hlediska návrhu a implementace v Javě rozhoduje násobnost o tom, zda bude vazba v kódu reprezentována jednoduchým odkazem (např. <code>private Zakaznik vlastnik;</code>), nebo kolekcí (např. <code>private List&lt;Vozidlo&gt; vozidla;</code>), a definuje povinnost existence vazby (integritní omezení).</p>

      <h4>Jak se to zapisuje v UML</h4>
      <ul>
        <li><strong>Grafická notace:</strong> Prostá asociace se zakresluje jako plná nepřerušovaná čára spojující obdélníky dvou tříd. Pokud na koncích čáry nejsou žádné šipky, jedná se o <strong>obousměrnou asociaci</strong> (obě třídy o sobě navzájem vědí a mohou spolu komunikovat).</li>
        <li><strong>Popisek asociace:</strong> Uprostřed spojovací čáry se uvádí název asociace (zpravidla sloveso v činném rodě vystihující význam vztahu, např. <code>vlastní</code>).</li>
        <li><strong>Zápis násobností:</strong> Na oba konce spojovací čáry těsně k okraji příslušné třídy se zapisuje rozsah <code>dolníMez..horníMez</code>. Nejčastější zápisy v návrhovém modelu jsou:
          <ul>
            <li><code>1</code> – právě jedna instance (povinná jednoznačná vazba, zkrácený zápis pro <code>1..1</code>),</li>
            <li><code>0..1</code> – žádná nebo nejvýše jedna instance (volitelná vazba, v Javě může být <code>null</code>),</li>
            <li><code>1..*</code> – alespoň jedna až neomezeně mnoho instancí (povinná neprázdná kolekce),</li>
            <li><code>0..*</code> (nebo <code>*</code>) – nula až neomezeně mnoho instancí (volitelná kolekce, může být prázdná).</li>
          </ul>
        </li>
      </ul>

      <h4>Na co si dát pozor (nejčastější chyby)</h4>
      <ul>
        <li><strong>Duplikování vazby jako atributu uvnitř třídy:</strong> Nejčastější chybou začátečníků je zakreslení asociace mezi <code>Zakaznik</code> a <code>Vozidlo</code> a zároveň dopsání atributu <code>-vozidla: List&lt;Vozidlo&gt;</code> dovnitř třídy <code>Zakaznik</code>. V UML je asociace plnohodnotným ekvivalentem referenčního atributu – odkaz se zakresluje buď čarou asociace, nebo atributem, nikdy obojím současně.</li>
        <li><strong>Prohození násobností na koncích vazby:</strong> Násobnost se vždy čte směrem od jedné instance protější třídy k cílové třídě. U vazby <code>Zakaznik "1" -- "1..*" Vozidlo</code> znamená <code>1..*</code> u vozidla, že jeden zákazník vlastní jedno až mnoho vozidel, zatímco <code>1</code> u zákazníka znamená, že jedno vozidlo patří právě jednomu zákazníkovi.</li>
        <li><strong>Opomenutí násobností:</strong> V analytickém náčrtu lze násobnost dočasně vynechat, v návrhovém diagramu však musí být násobnost přesně stanovena na obou stranách každé asociace.</li>
      </ul>

      <h4>Komentovaný příklad</h4>
      <p>Diagram propojuje třídy <code>Zakaznik</code> a <code>Vozidlo</code> prostou obousměrnou asociací s popiskem <code>vlastní</code>:</p>
      <ul>
        <li>Na straně třídy <code>Vozidlo</code> je uvedena násobnost <code>1..*</code>, což vyjadřuje obchodní pravidlo, že osoba je v systému vedena jako zákazník pouze tehdy, když vlastní alespoň jedno vozidlo (horní počet není omezen).</li>
        <li>Na straně třídy <code>Zakaznik</code> je uvedena násobnost <code>1</code>, což znamená, že každé vozidlo má v systému vždy právě jednoho vlastníka (spoluvlastnictví není podporováno).</li>
        <li>Protože na čáře nejsou žádné šipky, vazba je obousměrná: zákazník zná všechna svá vozidla a každé vozidlo zná svého vlastníka.</li>
      </ul>
    `,
    exampleDiagram: {
      caption: 'Ukázkový příklad (Autoservis): Prostá obousměrná asociace Zakaznik (1) — vlastní — (1..*) Vozidlo',
      classes: [
        {
          id: 'ex-t2-zakaznik',
          name: 'Zakaznik',
          stereotype: null,
          isAbstract: false,
          x: 20,
          y: 34,
          attributes: [
            { visibility: '-', name: 'zakaznikId', type: 'String', isStatic: false },
            { visibility: '-', name: 'prijmeni', type: 'String', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'pridejVozidlo', params: 'vozidlo: Vozidlo', returnType: 'void', isAbstract: false, isStatic: false }
          ]
        },
        {
          id: 'ex-t2-vozidlo',
          name: 'Vozidlo',
          stereotype: null,
          isAbstract: false,
          x: 345,
          y: 34,
          attributes: [
            { visibility: '-', name: 'vin', type: 'String', isStatic: false },
            { visibility: '-', name: 'spz', type: 'String', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'ziskejVin', params: '', returnType: 'String', isAbstract: false, isStatic: false }
          ]
        }
      ],
      relations: [
        {
          id: 'ex-t2-rel-1',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 'ex-t2-zakaznik',
          targetId: 'ex-t2-vozidlo',
          sourceMultiplicity: '1',
          targetMultiplicity: '1..*',
          label: 'vlastní'
        }
      ]
    },
    assignmentHtml: `
      <p>Vytvořte návrhový diagram tříd (UML 2.5) pro jazyk Java obsahující <strong>přesně dvě konkrétní třídy propojené jednou jednoduchou obousměrnou asociací</strong>. Odkaz mezi třídami vyjádřete výhradně vazbou, nikoli atributem uvnitř tříd; nemodelujte konstruktory ani další nespecifikované prvky.</p>
      <p>Třída <strong>Tvar</strong> eviduje soukromý atribut (<code>-</code>) <code>tvarId</code> typu <code>String</code> a poskytuje veřejnou operaci (<code>+</code>) <code>priradStyl</code> s parametrem <code>styl</code> typu <code>Styl</code> a návratovým typem <code>void</code>.</p>
      <p>Třída <strong>Styl</strong> eviduje soukromé atributy (<code>-</code>) <code>stylId</code> typu <code>String</code> a <code>barvaVyplne</code> typu <code>String</code>. Poskytuje veřejnou operaci (<code>+</code>) <code>zmenBarvuVyplne</code> s parametrem <code>hexBarva</code> typu <code>String</code> a návratovým typem <code>boolean</code>.</p>
      <p>Třídy <strong>Tvar</strong> a <strong>Styl</strong> propojte <strong>prostou obousměrnou asociací</strong> (bez šipek a bez kosočtverců) s popiskem <code>používá</code>. Jeden styl může používat libovolný počet tvarů nebo žádný (<code>0..*</code> na straně <code>Tvar</code>) a každý tvar může mít přiřazen nejvýše jeden styl nebo žádný (<code>0..1</code> na straně <code>Styl</code>). Názvy rolí na koncích vazby v této úloze neuvádějte.</p>
    `,
    requirements: [
      'Umístěte na plátno třídy <strong>Tvar</strong> a <strong>Styl</strong>.',
      'Propojte je <strong>prostou obousměrnou asociací</strong> (plná čára bez šipek) s popiskem <code>používá</code>.',
      'Nastavte násobnost <code>0..*</code> na straně <code>Tvar</code> a <code>0..1</code> na straně <code>Styl</code> (bez názvů rolí).'
    ],
    hints: [
      'Zvolte typ vazby „Prostá obousměrná asociace“. Dejte pozor na správnou stranu násobností: u třídy Tvar má být 0..* a u třídy Styl má být 0..1.'
    ],
    classes: [
      {
        id: 't2-tvar',
        kind: 'class',
        name: 'Tvar',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'tvarId', type: 'String', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'priradStyl', params: 'styl: Styl', returnType: 'void', isAbstract: false, isStatic: false }
        ]
      },
      {
        id: 't2-styl',
        kind: 'class',
        name: 'Styl',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'stylId', type: 'String', isStatic: false },
          { visibility: '-', name: 'barvaVyplne', type: 'String', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'zmenBarvuVyplne', params: 'hexBarva: String', returnType: 'boolean', isAbstract: false, isStatic: false }
        ]
      }
    ],
    validationRules: {
      counts: { classifiers: 2, relations: 1 },
      expectedClasses: ['t2-tvar', 't2-styl'],
      expectedRelations: [
        {
          id: 'rel-t2-1',
          type: 'association',
          navigability: 'bidirectional',
          sourceId: 't2-tvar',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 't2-styl',
          targetMultiplicity: '0..1',
          targetRole: null,
          label: 'používá',
          feedback: {
            wrongType: 'Mezi třídami Tvar a Styl použij prostou obousměrnou asociaci (plná čára bez šipek a bez kosočtverců).',
            wrongSourceMultiplicity: 'U vazby Tvar – Styl zkontroluj násobnost na straně Tvar (jeden styl může používat 0 až libovolný počet tvarů: 0..*).',
            wrongTargetMultiplicity: 'U vazby Tvar – Styl zkontroluj násobnost na straně Styl (tvar používá nejvýše jeden styl nebo žádný: 0..1).'
          }
        }
      ]
    }
  },

  // =========================================================================
  // t3: Navigovatelnost asociace a názvy rolí
  // Výklad + ukázka: Geometrie (Malování) | Zadání + validace: Banka
  // =========================================================================
  {
    id: 't3',
    order: 3,
    title: '1.3 Navigovatelnost asociace a názvy rolí',
    shortTitle: '1.3 Navigovatelnost a role',
    storyIntro: 'Minimalizuj obousměrné závislosti: otevřená šipka navigovatelnosti ukazuje směr reference v paměti a název role určuje jméno členské proměnné v cílovém směru.',
    theoryHtml: `
      <h4>Co to je a k čemu to slouží</h4>
      <p><strong>Navigovatelnost (směrovost)</strong> určuje, zda a jakým směrem dokáže objekt jedné třídy za běhu programu přistupovat k objektům třídy druhé. Zatímco v analýze jsou vazby často neorientované, v návrhovém modelu je minimalizace obousměrných vazeb klíčovým architektonickým pravidlem. Obousměrná vazba vytváří cyklickou závislost mezi třídami a komplikuje udržování konzistence dat v paměti. Pokud <code>Platno</code> potřebuje vědět, který <code>Tvar</code> je aktuálně označený, ale <code>Tvar</code> nepotřebuje znát odkaz na plátno, navrhneme vazbu jako jednosměrnou.</p>
      <p><strong>Název role</strong> upřesňuje konkrétní význam (funkci), jakou cílová třída v dané asociaci plní. V návrhovém diagramu má název role přímý implementační dopad: stává se názvem členské proměnné (atributu) ve zdrojové třídě při generování kódu v jazyce Java.</p>

      <h4>Jak se to zapisuje v UML</h4>
      <ul>
        <li><strong>Jednosměrná navigovatelnost:</strong> Zapisuje se jako plná čára zakončená otevřenou šipkou (<code>--&gt;</code>) na straně cílové třídy, do které lze navigovat. Zdrojová třída na opačném konci (bez šipky) drží referenci na cíl, zatímco cílová třída odkaz zpět neudržuje.</li>
        <li><strong>Obousměrná navigovatelnost:</strong> Zapisuje se buď plnou čárou bez šipek (<code>--</code>), nebo plnou čárou s otevřenými šipkami na obou koncích (<code>&lt;--&gt;</code>).</li>
        <li><strong>Názvy rolí:</strong> Zapisují se jako identifikátor (zpravidla v konvenci <code>camelCase</code>, bez diakritiky) na příslušný konec asociační čáry vedle násobnosti (např. <code>oznacenyTvar</code> nebo <code>kotevniBod</code>). Pokud je vazba jednosměrná, název role se uvádí pouze u navigovatelného konce (u šipky).</li>
      </ul>

      <h4>Na co si dát pozor (nejčastější chyby)</h4>
      <ul>
        <li><strong>Opačný směr šipky navigovatelnosti:</strong> Šipka ukazuje od třídy, která drží odkaz, ke třídě, na kterou je odkazováno. Pokud tvar definuje svou polohu pomocí kotevního bodu, šipka musí směřovat z <code>Tvar</code> na <code>Bod</code>, nikoli naopak.</li>
        <li><strong>Záměna otevřené asociační šipky za šipku dědičnosti:</strong> Navigovatelnost asociace používá jednoduchou otevřenou šipku (<code>--&gt;</code>), zatímco generalizace (dědičnost) používá uzavřený prázdný trojúhelník (<code>--|&gt;</code>).</li>
        <li><strong>Nechtěné obousměrné vazby:</strong> Ponechání všech vazeb bez šipek nutí programátora udržovat oboustranné reference, což je v návrhu zbytečné a náchylné k chybám.</li>
      </ul>

      <h4>Komentovaný příklad</h4>
      <p>Diagram ukazuje řetězec dvou jednosměrných asociací mezi třemi třídami:</p>
      <ul>
        <li><strong>Platno → Tvar (označuje):</strong> Otevřená šipka u třídy <code>Tvar</code> s rolí <code>oznacenyTvar</code> a násobnostmi <code>0..1</code> na obou stranách určuje, že plátno si udržuje jednosměrný odkaz na nejvýše jeden právě vybraný tvar (pokud není vybrán žádný, odkaz je <code>null</code>), zatímco samotný tvar odkaz zpět na plátno neudržuje.</li>
        <li><strong>Tvar → Bod (definuje polohu):</strong> Jednosměrná vazba s rolí <code>kotevniBod</code> a násobnostmi <code>1</code> na obou stranách vyjadřuje, že každý tvar drží přímý odkaz na svůj referenční bod, ale bod o tvaru neví.</li>
      </ul>
    `,
    exampleDiagram: {
      caption: 'Ukázkový příklad (Geometrie): Řetězec dvou jednosměrných asociací s rolemi',
      classes: [
        {
          id: 'ex-t3-platno',
          name: 'Platno',
          stereotype: null,
          isAbstract: false,
          x: 16,
          y: 26,
          attributes: [
            { visibility: '-', name: 'nazev', type: 'String', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'oznacTvar', params: 'tvar: Tvar', returnType: 'void', isAbstract: false, isStatic: false }
          ]
        },
        {
          id: 'ex-t3-tvar',
          name: 'Tvar',
          stereotype: null,
          isAbstract: false,
          x: 345,
          y: 26,
          attributes: [
            { visibility: '-', name: 'tvarId', type: 'String', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'posun', params: 'dx: double, dy: double', returnType: 'void', isAbstract: false, isStatic: false }
          ]
        },
        {
          id: 'ex-t3-bod',
          name: 'Bod',
          stereotype: null,
          isAbstract: false,
          x: 345,
          y: 205,
          attributes: [
            { visibility: '-', name: 'x', type: 'double', isStatic: false },
            { visibility: '-', name: 'y', type: 'double', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'posunO', params: 'dx: double, dy: double', returnType: 'void', isAbstract: false, isStatic: false }
          ]
        }
      ],
      relations: [
        {
          id: 'ex-t3-rel-1',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'ex-t3-platno',
          targetId: 'ex-t3-tvar',
          sourceMultiplicity: '0..1',
          targetMultiplicity: '0..1',
          targetRole: 'oznacenyTvar',
          label: 'označuje'
        },
        {
          id: 'ex-t3-rel-2',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'ex-t3-tvar',
          targetId: 'ex-t3-bod',
          sourceMultiplicity: '1',
          targetMultiplicity: '1',
          targetRole: 'kotevniBod',
          label: 'definuje polohu'
        }
      ]
    },
    assignmentHtml: `
      <p>Vytvořte návrhový diagram tříd (UML 2.5) pro jazyk Java obsahující <strong>přesně tři konkrétní třídy propojené dvěma jednosměrnými prostými asociacemi se zadanými rolemi</strong>. Odkazy vyjádřete výhradně vazbami; nemodelujte konstruktory ani další nespecifikované prvky.</p>
      <p>Třída <strong>BankovniUcet</strong> má soukromý atribut (<code>-</code>) <code>cisloUctu</code> typu <code>String</code> a veřejnou operaci (<code>+</code>) <code>vloz</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>.</p>
      <p>Třída <strong>Transakce</strong> má soukromé atributy (<code>-</code>) <code>transakceId</code> typu <code>String</code> a <code>castka</code> typu <code>BigDecimal</code>, a veřejnou bezparametrickou operaci (<code>+</code>) <code>jeKaretniTransakce</code> vracející <code>boolean</code>.</p>
      <p>Třída <strong>PlatebniKarta</strong> má soukromý atribut (<code>-</code>) <code>cisloKarty</code> typu <code>String</code> a veřejnou operaci (<code>+</code>) <code>overPin</code> s parametrem <code>zadanyPin</code> typu <code>String</code> vracející <code>boolean</code>.</p>
      <ul>
        <li>Mezi třídami <strong>BankovniUcet</strong> a <strong>Transakce</strong> vytvořte prostou jednosměrnou asociaci směřující z <code>BankovniUcet</code> na <code>Transakce</code> (šipka u <code>Transakce</code>) s popiskem <code>eviduje</code>. Na straně <code>BankovniUcet</code> uveďte násobnost <code>1</code> (bez názvu role), na straně <code>Transakce</code> uveďte násobnost <code>0..*</code> a název role <code>transakce</code>.</li>
        <li>Mezi třídami <strong>Transakce</strong> a <strong>PlatebniKarta</strong> vytvořte prostou jednosměrnou asociaci směřující z <code>Transakce</code> na <code>PlatebniKarta</code> (šipka u <code>PlatebniKarta</code>) s popiskem <code>provedena pomocí</code>. Na straně <code>Transakce</code> uveďte násobnost <code>0..*</code> (bez názvu role), na straně <code>PlatebniKarta</code> uveďte násobnost <code>0..1</code> a název role <code>pouzitaKarta</code>.</li>
      </ul>
    `,
    requirements: [
      'Umístěte na plátno třídy <strong>BankovniUcet</strong>, <strong>Transakce</strong> a <strong>PlatebniKarta</strong>.',
      'Vytvořte jednosměrnou asociaci <code>BankovniUcet (1)</code> → <code>Transakce (0..*, role: transakce)</code> s popiskem <code>eviduje</code>.',
      'Vytvořte jednosměrnou asociaci <code>Transakce (0..*)</code> → <code>PlatebniKarta (0..1, role: pouzitaKarta)</code> s popiskem <code>provedena pomocí</code>.'
    ],
    hints: [
      'Šipka směřuje od třídy držící odkaz k cílové třídě: nejprve BankovniUcet → Transakce (role transakce), poté Transakce → PlatebniKarta (role pouzitaKarta).'
    ],
    classes: [
      {
        id: 't3-ucet',
        kind: 'class',
        name: 'BankovniUcet',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'cisloUctu', type: 'String', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'vloz', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false }
        ]
      },
      {
        id: 't3-transakce',
        kind: 'class',
        name: 'Transakce',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'transakceId', type: 'String', isStatic: false },
          { visibility: '-', name: 'castka', type: 'BigDecimal', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'jeKaretniTransakce', params: '', returnType: 'boolean', isAbstract: false, isStatic: false }
        ]
      },
      {
        id: 't3-karta',
        kind: 'class',
        name: 'PlatebniKarta',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'cisloKarty', type: 'String', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'overPin', params: 'zadanyPin: String', returnType: 'boolean', isAbstract: false, isStatic: false }
        ]
      }
    ],
    validationRules: {
      counts: { classifiers: 3, relations: 2 },
      expectedClasses: ['t3-ucet', 't3-transakce', 't3-karta'],
      expectedRelations: [
        {
          id: 'rel-t3-1',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 't3-ucet',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 't3-transakce',
          targetMultiplicity: '0..*',
          targetRole: 'transakce',
          label: 'eviduje',
          feedback: {
            wrongTargetRole: 'U jednosměrné asociace BankovniUcet → Transakce zkontroluj název role u cílové třídy Transakce (má být "transakce").'
          }
        },
        {
          id: 'rel-t3-2',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 't3-transakce',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 't3-karta',
          targetMultiplicity: '0..1',
          targetRole: 'pouzitaKarta',
          label: 'provedena pomocí',
          feedback: {
            wrongTargetMultiplicity: 'U vazby Transakce → PlatebniKarta nastav násobnost na straně PlatebniKarta na "0..1" (bezhotovostní převod kartu nepoužívá).',
            wrongTargetRole: 'U jednosměrné asociace Transakce → PlatebniKarta zkontroluj název role u cílové třídy PlatebniKarta (má být "pouzitaKarta").'
          }
        }
      ]
    }
  },

  // =========================================================================
  // t4: Agregace (slabá vazba celek–část)
  // Výklad + ukázka: Banka | Zadání + validace: Geometrie (Malování)
  // =========================================================================
  {
    id: 't4',
    order: 4,
    title: '1.4 Agregace (slabá vazba celek–část)',
    shortTitle: '1.4 Agregace (celek–část)',
    storyIntro: 'Rozlišuj běžnou asociaci od vztahu celek–část: agregace (prázdný kosočtverec na straně celku) seskupuje části, které však mohou existovat i samostatně.',
    theoryHtml: `
      <h4>Co to je a k čemu to slouží</h4>
      <p><strong>Agregace</strong> je speciální formou asociace, která vyjadřuje vztah <strong>celek–část</strong> (vztah „má / sdružuje“), při němž mají celek i jeho části <strong>nezávislý životní cyklus</strong>. Část je organizačně zařazena do celku, ale její existence není na existenci celku podmíněna – pokud objekt celku zanikne (je smazán), objekty jeho částí v systému nadále existují a mohou být přiřazeny k jinému celku nebo fungovat samostatně.</p>
      <p>V návrhovém modelu pomáhá agregace odlišit pouhé organizační seskupení sdílených nebo samostatně existujících entit od striktního vlastnictví životního cyklu (kompozice).</p>

      <h4>Jak se to zapisuje v UML</h4>
      <ul>
        <li><strong>Grafická notace:</strong> Agregace se zakresluje jako asociace zakončená <strong>prázdným (nevyplněným) kosočtvercem na straně celku</strong> (<code>o--</code> nebo <code>o--&gt;</code> při jednosměrné navigovatelnosti).</li>
        <li><strong>Násobnosti a role:</strong> Na straně celku (u prázdného kosočtverce) bývá násobnost nejčastěji <code>0..1</code> (část nemusí být v daný okamžik přiřazena k žádnému celku, případně je v jednom celku) nebo <code>0..*</code> (pokud může být stejná část sdílena více celky současně). Na straně části se uvádí odpovídající násobnost (<code>0..*</code>, <code>1..*</code> apod.) a název role kolekce.</li>
      </ul>

      <h4>Na co si dát pozor (nejčastější chyby)</h4>
      <ul>
        <li><strong>Umístění kosočtverce na špatný konec vazby:</strong> Kosočtverec patří vždy na stranu celku (nadřazeného kontejneru), nikoli na stranu části.</li>
        <li><strong>Záměna agregace a kompozice:</strong> Pokud zánik celku automaticky znamená smazání všech částí (např. smazání objednávky smaže její řádky), nejde o agregaci, ale o kompozici.</li>
        <li><strong>Násobnost 1 na straně celku u agregace:</strong> Pokud by část mohla existovat výhradně v rámci právě jednoho celku (<code>1</code>), v praxi jde téměř vždy o kompozici. Pro agregaci je typická volitelná příslušnost (<code>0..1</code>) nebo sdílení (<code>0..*</code>).</li>
      </ul>

      <h4>Komentovaný příklad</h4>
      <p>Diagram zachycuje organizační vztah mezi třídou <code>Pobocka</code> (celek) a třídou <code>Klient</code> (část) pomocí jednosměrné agregace <code>spravuje</code>:</p>
      <ul>
        <li>Prázdný kosočtverec u třídy <code>Pobocka</code> značí, že pobočka sdružuje své <code>kmenoviKlienti</code> (<code>0..*</code>).</li>
        <li>Násobnost <code>0..1</code> na straně pobočky vyjadřuje, že klient spadá nejvýše pod jednu kmenovou pobočku, ale může v systému existovat i bez přiřazené pobočky (např. čistě digitální klient).</li>
        <li>Pokud banka konkrétní pobočku zruší, záznamy klientů v systému nezanikají – klienti si uchovávají své účty a mohou být převedeni pod jinou pobočku.</li>
      </ul>
    `,
    exampleDiagram: {
      caption: 'Ukázkový příklad (Banka): Jednosměrná agregace Pobocka (0..1) ◇— spravuje —> (0..*) Klient',
      classes: [
        {
          id: 'ex-t4-pobocka',
          name: 'Pobocka',
          stereotype: null,
          isAbstract: false,
          x: 20,
          y: 34,
          attributes: [
            { visibility: '-', name: 'kodPobocky', type: 'String', isStatic: false },
            { visibility: '-', name: 'mesto', type: 'String', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'priradKlienta', params: 'klient: Klient', returnType: 'void', isAbstract: false, isStatic: false }
          ]
        },
        {
          id: 'ex-t4-klient',
          name: 'Klient',
          stereotype: null,
          isAbstract: false,
          x: 365,
          y: 34,
          attributes: [
            { visibility: '-', name: 'klientId', type: 'String', isStatic: false },
            { visibility: '-', name: 'prijmeni', type: 'String', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'ziskejCelkovyZustatek', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false }
          ]
        }
      ],
      relations: [
        {
          id: 'ex-t4-rel-1',
          type: 'aggregation',
          navigability: 'unidirectional',
          sourceId: 'ex-t4-pobocka',
          targetId: 'ex-t4-klient',
          sourceMultiplicity: '0..1',
          targetMultiplicity: '0..*',
          targetRole: 'kmenoviKlienti',
          label: 'spravuje'
        }
      ]
    },
    assignmentHtml: `
      <p>Vytvořte návrhový diagram tříd (UML 2.5) pro jazyk Java obsahující <strong>přesně dvě konkrétní třídy propojené jednou jednosměrnou agregací</strong>. Odkaz vyjádřete výhradně vazbou; nemodelujte konstruktory ani další nespecifikované prvky.</p>
      <p>Třída <strong>Paleta</strong> eviduje soukromý atribut (<code>-</code>) <code>nazev</code> typu <code>String</code> a nabízí veřejnou operaci (<code>+</code>) <code>pridejStyl</code> s parametrem <code>styl</code> typu <code>Styl</code> a návratovým typem <code>void</code>.</p>
      <p>Třída <strong>Styl</strong> eviduje soukromé atributy (<code>-</code>) <code>stylId</code> typu <code>String</code> a <code>barvaVyplne</code> typu <code>String</code>. Nabízí veřejnou operaci (<code>+</code>) <code>zmenBarvuVyplne</code> s parametrem <code>hexBarva</code> typu <code>String</code> a návratovým typem <code>boolean</code>.</p>
      <p>Paleta sdružuje styly jako <strong>slabá vazba celek–část s nezávislým životním cyklem</strong> (při smazání palety styly v systému nadále zůstávají). Modelujte <strong>jednosměrnou agregaci</strong> z celku <code>Paleta</code> (prázdný kosočtverec u <code>Paleta</code>) k části <code>Styl</code> (šipka navigovatelnosti u <code>Styl</code>) s popiskem <code>sdružuje</code>. Na straně <code>Paleta</code> uveďte násobnost <code>0..1</code> (bez názvu role), na straně <code>Styl</code> uveďte násobnost <code>0..*</code> a název role <code>styly</code>.</p>
    `,
    requirements: [
      'Umístěte na plátno třídy <strong>Paleta</strong> a <strong>Styl</strong>.',
      'Propojte je <strong>jednosměrnou agregací</strong> (prázdný kosočtverec u <code>Paleta</code>, otevřená šipka u <code>Styl</code>) s popiskem <code>sdružuje</code>.',
      'Nastavte násobnost <code>0..1</code> u <code>Paleta</code> a <code>0..*</code> s rolí <code>styly</code> u <code>Styl</code>.'
    ],
    hints: [
      'Styly přežijí i smazání palety – použijte jednosměrnou agregaci (prázdný kosočtverec u celku Paleta) s násobností 0..1 u Paleta a 0..* (role styly) u Styl.'
    ],
    classes: [
      {
        id: 't4-paleta',
        kind: 'class',
        name: 'Paleta',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'nazev', type: 'String', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'pridejStyl', params: 'styl: Styl', returnType: 'void', isAbstract: false, isStatic: false }
        ]
      },
      {
        id: 't4-styl',
        kind: 'class',
        name: 'Styl',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'stylId', type: 'String', isStatic: false },
          { visibility: '-', name: 'barvaVyplne', type: 'String', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'zmenBarvuVyplne', params: 'hexBarva: String', returnType: 'boolean', isAbstract: false, isStatic: false }
        ]
      }
    ],
    validationRules: {
      counts: { classifiers: 2, relations: 1 },
      expectedClasses: ['t4-paleta', 't4-styl'],
      expectedRelations: [
        {
          id: 'rel-t4-1',
          type: 'aggregation',
          navigability: 'unidirectional',
          sourceId: 't4-paleta',
          sourceMultiplicity: '0..1',
          sourceRole: null,
          targetId: 't4-styl',
          targetMultiplicity: '0..*',
          targetRole: 'styly',
          label: 'sdružuje',
          feedback: {
            wrongType: 'Mezi třídami Paleta a Styl jde o slabý vztah celek–část s nezávislým životním cyklem – použij agregaci (prázdný kosočtverec), nikoli kompozici.',
            wrongSourceMultiplicity: 'Na straně celku Paleta nastav násobnost "0..1" (styl může existovat i mimo jakoukoli paletu).',
            wrongTargetRole: 'Na straně části Styl uveď název role "styly".'
          }
        }
      ]
    }
  },

  // =========================================================================
  // t5: Kompozice (silná vazba celek–část)
  // Výklad + ukázka: Geometrie (Malování) | Zadání + validace: Autoservis
  // =========================================================================
  {
    id: 't5',
    order: 5,
    title: '1.5 Kompozice (silná vazba celek–část)',
    shortTitle: '1.5 Kompozice (celek–část)',
    storyIntro: 'Když část nemůže existovat bez svého celku a při jeho zrušení automaticky zaniká, nastupuje kompozice s plným kosočtvercem u celku.',
    theoryHtml: `
      <h4>Co to je a k čemu to slouží</h4>
      <p><strong>Kompozice</strong> je nejsilnější formou vztahu celek–část, která vyjadřuje <strong>existenční závislost části na celku</strong> (striktní vlastnictví životního cyklu). Část je neoddělitelnou strukturální složkou jediného celku:</p>
      <ul>
        <li>Část nemůže v systému existovat samostatně bez svého celku.</li>
        <li>V daný okamžik může být konkrétní instance části součástí nejvýše jednoho celku (část nelze sdílet mezi více celky).</li>
        <li>Při zániku (odstranění) celku jsou automaticky a kaskádově zničeny i všechny jeho části.</li>
      </ul>
      <p>V návrhovém modelu a při implementaci v Javě kompozice přímo určuje odpovědnost za vytváření a rušení objektů (kaskádové mazání a uvolňování v paměti).</p>

      <h4>Jak se to zapisuje v UML</h4>
      <ul>
        <li><strong>Grafická notace:</strong> Kompozice se zakresluje jako asociace zakončená <strong>plným (černě vyplněným) kosočtvercem na straně celku</strong> (<code>*--</code> nebo <code>*--&gt;</code> při jednosměrné navigovatelnosti).</li>
        <li><strong>Násobnosti a role:</strong> Na straně celku (u plného kosočtverce) je násobnost vždy <code>1</code> (nebo výjimečně <code>0..1</code>, pokud může být daný typ části volitelně vlastněn jiným typem celku, nikdy však <code>*</code>). Na straně části se uvádí násobnost podle doménových pravidel (<code>1</code>, <code>0..1</code>, <code>1..*</code>, <code>0..*</code>) a název role.</li>
      </ul>

      <h4>Na co si dát pozor (nejčastější chyby)</h4>
      <ul>
        <li><strong>Násobnost * nebo 1..* na straně plného kosočtverce:</strong> Protože kompozice zakazuje sdílení jedné instance části mezi více celky současně, násobnost na straně celku nesmí být nikdy větší než <code>1</code>.</li>
        <li><strong>Nadužívání kompozice tam, kde jde o prostou asociaci:</strong> Například mezi <code>Platno</code> a označeným <code>Tvar</code> není kompozice (zrušením označení tvar nezaniká), zatímco mezi <code>Platno</code> a <code>Vrstva</code> kompozice je.</li>
      </ul>

      <h4>Komentovaný příklad</h4>
      <p>Diagram modeluje strukturální vztah mezi třídou <code>Platno</code> (celek) a třídou <code>Vrstva</code> (část) pomocí jednosměrné kompozice <code>obsahuje</code>:</p>
      <ul>
        <li>Plný kosočtverec u třídy <code>Platno</code> s násobností <code>1</code> vyjadřuje, že každá kreslicí vrstva je neoddělitelnou součástí právě jednoho plátna, nemůže existovat samostatně a při zavření či odstranění plátna zanikají i všechny jeho vrstvy.</li>
        <li>Násobnost <code>1..*</code> a role <code>vrstvy</code> na straně třídy <code>Vrstva</code> určují, že každé plátno musí obsahovat alespoň jednu vrstvu (horní počet není omezen) a udržuje na ně jednosměrný odkaz.</li>
      </ul>
    `,
    exampleDiagram: {
      caption: 'Ukázkový příklad (Geometrie): Jednosměrná kompozice Platno (1) ◆— obsahuje —> (1..*) Vrstva',
      classes: [
        {
          id: 'ex-t5-platno',
          name: 'Platno',
          stereotype: null,
          isAbstract: false,
          x: 20,
          y: 34,
          attributes: [
            { visibility: '-', name: 'nazev', type: 'String', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'pridejVrstvu', params: 'vrstva: Vrstva', returnType: 'void', isAbstract: false, isStatic: false }
          ]
        },
        {
          id: 'ex-t5-vrstva',
          name: 'Vrstva',
          stereotype: null,
          isAbstract: false,
          x: 345,
          y: 34,
          attributes: [
            { visibility: '-', name: 'vrstvaId', type: 'String', isStatic: false },
            { visibility: '-', name: 'poradiZ', type: 'int', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'nastavViditelnost', params: 'viditelna: boolean', returnType: 'void', isAbstract: false, isStatic: false }
          ]
        }
      ],
      relations: [
        {
          id: 'ex-t5-rel-1',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 'ex-t5-platno',
          targetId: 'ex-t5-vrstva',
          sourceMultiplicity: '1',
          targetMultiplicity: '1..*',
          targetRole: 'vrstvy',
          label: 'obsahuje'
        }
      ]
    },
    assignmentHtml: `
      <p>Vytvořte návrhový diagram tříd (UML 2.5) pro jazyk Java obsahující <strong>přesně dvě konkrétní třídy propojené jednou jednosměrnou kompozicí</strong>. Odkaz mezi třídami vyjádřete výhradně vazbou; nemodelujte konstruktory ani další nespecifikované prvky.</p>
      <p>Třída <strong>ServisniZakazka</strong> eviduje soukromé atributy (<code>-</code>) <code>cisloZakazky</code> typu <code>String</code> a <code>stav</code> typu <code>String</code>. Nabízí veřejnou operaci (<code>+</code>) <code>pridejPolozku</code> s parametrem <code>polozka</code> typu <code>PolozkaZakazky</code> a návratovým typem <code>void</code>.</p>
      <p>Třída <strong>PolozkaZakazky</strong> eviduje soukromé atributy (<code>-</code>) <code>polozkaId</code> typu <code>String</code> a <code>popis</code> typu <code>String</code>. Nabízí veřejnou bezparametrickou operaci (<code>+</code>) <code>vypoctiMezisoucet</code> s návratovým typem <code>BigDecimal</code>.</p>
      <p>Položka zakázky je <strong>existenčně závislou součástí servisní zakázky</strong> a při zrušení zakázky zanikají všechny její položky. Modelujte <strong>jednosměrnou kompozici</strong> z celku <code>ServisniZakazka</code> (plný kosočtverec u <code>ServisniZakazka</code>) k části <code>PolozkaZakazky</code> (šipka navigovatelnosti u <code>PolozkaZakazky</code>) s popiskem <code>obsahuje</code>. Na straně <code>ServisniZakazka</code> uveďte násobnost <code>1</code> (bez názvu role), na straně <code>PolozkaZakazky</code> uveďte násobnost <code>1..*</code> a název role <code>polozky</code>.</p>
    `,
    requirements: [
      'Umístěte na plátno třídy <strong>ServisniZakazka</strong> a <strong>PolozkaZakazky</strong>.',
      'Propojte je <strong>jednosměrnou kompozicí</strong> (plný kosočtverec u <code>ServisniZakazka</code>, otevřená šipka u <code>PolozkaZakazky</code>) s popiskem <code>obsahuje</code>.',
      'Nastavte násobnost <code>1</code> u <code>ServisniZakazka</code> a <code>1..*</code> s rolí <code>polozky</code> u <code>PolozkaZakazky</code>.'
    ],
    hints: [
      'Plný kosočtverec kompozice patří vždy na stranu celku (ServisniZakazka) a násobnost u něj musí být přesně 1.'
    ],
    classes: [
      {
        id: 't5-zakazka',
        kind: 'class',
        name: 'ServisniZakazka',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'cisloZakazky', type: 'String', isStatic: false },
          { visibility: '-', name: 'stav', type: 'String', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'pridejPolozku', params: 'polozka: PolozkaZakazky', returnType: 'void', isAbstract: false, isStatic: false }
        ]
      },
      {
        id: 't5-polozka',
        kind: 'class',
        name: 'PolozkaZakazky',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'polozkaId', type: 'String', isStatic: false },
          { visibility: '-', name: 'popis', type: 'String', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'vypoctiMezisoucet', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false }
        ]
      }
    ],
    validationRules: {
      counts: { classifiers: 2, relations: 1 },
      expectedClasses: ['t5-zakazka', 't5-polozka'],
      expectedRelations: [
        {
          id: 'rel-t5-1',
          type: 'composition',
          navigability: 'unidirectional',
          sourceId: 't5-zakazka',
          sourceMultiplicity: '1',
          sourceRole: null,
          targetId: 't5-polozka',
          targetMultiplicity: '1..*',
          targetRole: 'polozky',
          label: 'obsahuje',
          feedback: {
            wrongType: 'Položka zakázky nemůže existovat bez své servisní zakázky – použij kompozici (plný kosočtverec), nikoli agregaci.',
            wrongSourceMultiplicity: 'U kompozice mezi ServisniZakazka a PolozkaZakazky musí být na straně celku (ServisniZakazka) násobnost "1".',
            wrongTargetRole: 'Na straně části PolozkaZakazky uveď název role "polozky".'
          }
        }
      ]
    }
  },

  // =========================================================================
  // t6: Generalizace a dědičnost (rodič vs. potomek)
  // Výklad + ukázka: Autoservis | Zadání + validace: Banka
  // =========================================================================
  {
    id: 't6',
    order: 6,
    title: '1.6 Generalizace a dědičnost (rodič vs. potomek)',
    shortTitle: '1.6 Generalizace a dědičnost',
    storyIntro: 'Společné vlastnosti a operace přesuň do nadtřídy a pamatuj: prázdný trojúhelník dědičnosti vždy míří od potomka k rodiči a nikdy na něj nepatří násobnosti.',
    theoryHtml: `
      <h4>Co to je a k čemu to slouží</h4>
      <p><strong>Generalizace (dědičnost)</strong> je vztah mezi obecnější nadtřídou (rodičem / předkem) a specializovanější podtřídou (potomkem), známý jako vztah typu <strong>„je“ (is-a)</strong> – např. <em>Osobní auto je vozidlo</em>. V návrhovém modelu slouží dědičnost k:</p>
      <ul>
        <li><strong>Znovupoužití kódu:</strong> Společné atributy a metody jsou definovány pouze jednou v nadtřídě a všechny podtřídy je automaticky dědí.</li>
        <li><strong>Specializaci a rozšiřování:</strong> Podtřídy přidávají své specifické atributy a metody, případně překrývají (override) zděděné metody z nadtřídy, aby upravily jejich chování.</li>
        <li><strong>Polymorfismu:</strong> Klientský kód může pracovat jednotně s referencí na nadtřídu (např. odkaz typu <code>Vozidlo</code> v servisní zakázce), přičemž za běhu se zavolá konkrétní implementace metody podle skutečného typu potomka (<code>OsobniAuto</code> nebo <code>Dodavka</code>).</li>
      </ul>

      <h4>Jak se to zapisuje v UML</h4>
      <ul>
        <li><strong>Grafická notace:</strong> Generalizace se zakresluje jako plná čára zakončená <strong>velkým prázdným (nevyplněným) trojúhelníkem směřujícím k nadtřídě</strong> (<code>&lt;|--</code>).</li>
        <li><strong>Překrývání metod a chráněná viditelnost:</strong> Pokud podtřída mění chování zděděné metody, zapíše se signatura této metody znovu do podtřídy. Atributy a pomocné metody v nadtřídě, ke kterým mají potomci přímo přistupovat, se označují viditelností <code>#</code> (<code>protected</code>).</li>
        <li><strong>Bez násobností a popisků:</strong> Na čáře generalizace se nikdy neuvádějí násobnosti, role ani názvy asociací, protože nejde o vazbu mezi dvěma objekty, ale o vztah mezi dvěma třídami v typovém systému.</li>
      </ul>

      <h4>Na co si dát pozor (nejčastější chyby)</h4>
      <ul>
        <li><strong>Obrácený směr trojúhelníku:</strong> Velmi častou chybou je nakreslení trojúhelníkové šipky směrem od rodiče k potomkovi. V UML šipka generalizace vždy směřuje <strong>od potomka k rodiči</strong> (potomek se odkazuje na svého předka).</li>
        <li><strong>Zbytečné opakování zděděných atributů v podtřídách:</strong> Atributy deklarované v nadtřídě (např. <code>vin</code> nebo <code>najeteKm</code>) se v podtřídách již znovu nepíší – podtřída je má automaticky. Do podtřídy se zapisují pouze nové atributy a překryté nebo nové metody.</li>
        <li><strong>Zneužití dědičnosti místo kompozice či asociace:</strong> Například <code>PolozkaZakazky</code> není druhem servisní zakázky (nejde o vztah <em>is-a</em>), proto nesmí dědit ze <code>ServisniZakazka</code>.</li>
      </ul>

      <h4>Komentovaný příklad</h4>
      <p>Diagram zachycuje dědičnou hierarchii vozidel v autoservisu:</p>
      <ul>
        <li>Nadtřída <code>Vozidlo</code> definuje společný základ: soukromý <code>-vin: String</code>, chráněný <code>#najeteKm: int</code> (přístupný potomkům) a veřejné metody <code>+vypoctiZakladniSazbu(): BigDecimal</code> a <code>+aktualizujNajezd(noveKm: int): boolean</code>.</li>
        <li>Podtřídy <code>OsobniAuto</code> a <code>Dodavka</code> jsou napojeny na <code>Vozidlo</code> plnou čárou s prázdným trojúhelníkem u rodiče.</li>
        <li><code>OsobniAuto</code> přidává vlastní atribut <code>-pocetMist: int</code>, zatímco <code>Dodavka</code> přidává <code>-nosnostKg: double</code>. Obě podtřídy uvádějí metodu <code>+vypoctiZakladniSazbu(): BigDecimal</code>, čímž vyjadřují, že výpočet základní servisní sazby překrývají podle své kategorie.</li>
      </ul>
    `,
    exampleDiagram: {
      caption: 'Ukázkový příklad (Autoservis): Generalizace podtříd OsobniAuto a Dodavka k nadtřídě Vozidlo',
      classes: [
        {
          id: 'ex-t6-vozidlo',
          name: 'Vozidlo',
          stereotype: null,
          isAbstract: false,
          x: 185,
          y: 16,
          attributes: [
            { visibility: '-', name: 'vin', type: 'String', isStatic: false },
            { visibility: '#', name: 'najeteKm', type: 'int', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'vypoctiZakladniSazbu', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
            { visibility: '+', name: 'aktualizujNajezd', params: 'noveKm: int', returnType: 'boolean', isAbstract: false, isStatic: false }
          ]
        },
        {
          id: 'ex-t6-osobni',
          name: 'OsobniAuto',
          stereotype: null,
          isAbstract: false,
          x: 16,
          y: 205,
          attributes: [
            { visibility: '-', name: 'pocetMist', type: 'int', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'vypoctiZakladniSazbu', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false }
          ]
        },
        {
          id: 'ex-t6-dodavka',
          name: 'Dodavka',
          stereotype: null,
          isAbstract: false,
          x: 345,
          y: 205,
          attributes: [
            { visibility: '-', name: 'nosnostKg', type: 'double', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'vypoctiZakladniSazbu', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false }
          ]
        }
      ],
      relations: [
        {
          id: 'ex-t6-rel-1',
          type: 'generalization',
          sourceId: 'ex-t6-osobni',
          targetId: 'ex-t6-vozidlo'
        },
        {
          id: 'ex-t6-rel-2',
          type: 'generalization',
          sourceId: 'ex-t6-dodavka',
          targetId: 'ex-t6-vozidlo'
        }
      ]
    },
    assignmentHtml: `
      <p>Vytvořte návrhový diagram tříd (UML 2.5) pro jazyk Java obsahující <strong>přesně tři konkrétní třídy uspořádané do dědičné hierarchie</strong>. V tomto úkolu je nadtřída <code>BankovniUcet</code> stále konkrétní (nikoli abstraktní). Nemodelujte konstruktory ani žádné další nespecifikované prvky.</p>
      <p>Nadtřída <strong>BankovniUcet</strong> má soukromý atribut (<code>-</code>) <code>cisloUctu</code> typu <code>String</code> a chráněný atribut (<code>#</code>) <code>zustatek</code> typu <code>BigDecimal</code>. Poskytuje dvě konkrétní veřejné operace (<code>+</code>): <code>vloz</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code> a <code>vyber</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>.</p>
      <p>Podtřída <strong>BeznyUcet</strong> dědí z <code>BankovniUcet</code>, přidává soukromý atribut (<code>-</code>) <code>kontokorentLimit</code> typu <code>BigDecimal</code> a překrývá veřejnou operaci (<code>+</code>) <code>vyber</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>.</p>
      <p>Podtřída <strong>SporiciUcet</strong> dědí z <code>BankovniUcet</code>, přidává soukromý atribut (<code>-</code>) <code>urokovaSazba</code> typu <code>double</code> a překrývá veřejnou operaci (<code>+</code>) <code>vyber</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>.</p>
      <p>Dědičnost vyjádřete <strong>dvěma vazbami generalizace</strong> (plná čára s prázdnou trojúhelníkovou šipkou směřující vždy k rodiči <code>BankovniUcet</code>): od <code>BeznyUcet</code> k <code>BankovniUcet</code> a od <code>SporiciUcet</code> k <code>BankovniUcet</code>.</p>
    `,
    requirements: [
      'Umístěte na plátno konkrétní třídy <strong>BankovniUcet</strong>, <strong>BeznyUcet</strong> a <strong>SporiciUcet</strong>.',
      'Vytvořte vazbu <strong>generalizace</strong> od potomka <code>BeznyUcet</code> (zdroj) k rodiči <code>BankovniUcet</code> (cíl) bez násobností.',
      'Vytvořte vazbu <strong>generalizace</strong> od potomka <code>SporiciUcet</code> (zdroj) k rodiči <code>BankovniUcet</code> (cíl) bez násobností.'
    ],
    hints: [
      'Zvolte typ „Generalizace / dědičnost“ a veďte vazbu vždy od podtřídy (BeznyUcet, SporiciUcet) k nadtřídě (BankovniUcet).'
    ],
    classes: [
      {
        id: 't6-ucet',
        kind: 'class',
        name: 'BankovniUcet',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'cisloUctu', type: 'String', isStatic: false },
          { visibility: '#', name: 'zustatek', type: 'BigDecimal', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'vloz', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false },
          { visibility: '+', name: 'vyber', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false }
        ]
      },
      {
        id: 't6-bezny',
        kind: 'class',
        name: 'BeznyUcet',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'kontokorentLimit', type: 'BigDecimal', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'vyber', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false }
        ]
      },
      {
        id: 't6-sporici',
        kind: 'class',
        name: 'SporiciUcet',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'urokovaSazba', type: 'double', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'vyber', params: 'castka: BigDecimal', returnType: 'boolean', isAbstract: false, isStatic: false }
        ]
      }
    ],
    validationRules: {
      counts: { classifiers: 3, relations: 2 },
      expectedClasses: ['t6-ucet', 't6-bezny', 't6-sporici'],
      expectedRelations: [
        {
          id: 'rel-t6-1',
          type: 'generalization',
          sourceId: 't6-bezny',
          targetId: 't6-ucet',
          feedback: {
            wrongDirection: 'Generalizace mezi BeznyUcet a BankovniUcet má obrácený směr – prázdný trojúhelník musí směřovat od potomka (BeznyUcet) k rodiči (BankovniUcet).'
          }
        },
        {
          id: 'rel-t6-2',
          type: 'generalization',
          sourceId: 't6-sporici',
          targetId: 't6-ucet',
          feedback: {
            wrongDirection: 'Generalizace mezi SporiciUcet a BankovniUcet má obrácený směr – prázdný trojúhelník musí směřovat od potomka (SporiciUcet) k rodiči (BankovniUcet).'
          }
        }
      ]
    }
  },

  // =========================================================================
  // t7: Abstraktní třída a rozhraní («abstract», «interface»)
  // Výklad + ukázka: Geometrie (Malování) | Zadání + validace: Autoservis
  // =========================================================================
  {
    id: 't7',
    order: 7,
    title: '1.7 Abstraktní třída a rozhraní («abstract», «interface»)',
    shortTitle: '1.7 Abstraktní třída a rozhraní',
    storyIntro: 'Závěrečný pilíř teorie spojuje abstraktní základ se schopnostmi rozhraní. Rozlišuj plnou čáru dědičnosti od přerušované čáry realizace rozhraní.',
    theoryHtml: `
      <h4>Co to je a k čemu to slouží</h4>
      <p>V pokročilém objektovém návrhu potřebujeme definovat obecné kontrakty chování bez nutnosti nebo možnosti vytvářet instance obecných pojmů:</p>
      <ul>
        <li><strong>Abstraktní třída:</strong> Nadtřída, ze které nelze přímo vytvářet instance (nelze zavolat <code>new Tvar()</code>). Slouží jako společný základ pro své konkrétní potomky – může obsahovat běžné atributy, konkrétní metody se sdílenou implementací i <strong>abstraktní metody</strong> (metody bez těla, jejichž implementaci vynucuje u všech konkrétních potomků).</li>
        <li><strong>Rozhraní (interface):</strong> Čistý kontrakt chování (sada veřejných abstraktních operací bez stavu), který definuje určitou schopnost nebo roli třídy (v Javě často pojmenované přídavným jménem, např. <code>Otacitelny</code>, <code>Comparable</code>, <code>Serializable</code>). Zatímco v Javě může třída dědit pouze z jedné nadtřídy (jednoduchá dědičnost), <strong>realizovat (implementovat) může libovolný počet rozhraní</strong>.</li>
      </ul>

      <h4>Jak se to zapisuje v UML</h4>
      <ul>
        <li><strong>Abstraktní třída a abstraktní metoda:</strong>
          <ul>
            <li>Název abstraktní třídy se v UML zapisuje <em>kurzívou</em> nebo se před něj či nad něj uvádí klíčové slovo/stereotyp <code>abstract</code> / <code>«abstract»</code> (v PlantUML <code>abstract class NazevTridy</code>).</li>
            <li>Abstraktní metoda se zapisuje <em>kurzívou</em> nebo se značkou <code>{abstract}</code> (v PlantUML <code>{abstract} +nazevMetody(...): Typ</code>).</li>
          </ul>
        </li>
        <li><strong>Rozhraní («interface»):</strong> Zapisuje se jako obdélník se stereotypem <code>«interface»</code> nad názvem rozhraní (v PlantUML <code>interface NazevRozhrani</code>). Sekce atributů se u rozhraní neuvádí (nebo zůstává prázdná), v sekci operací jsou veřejné deklarace metod.</li>
        <li><strong>Vazba realizace rozhraní:</strong> Propojení mezi konkrétní třídou a rozhraním se zakresluje jako <strong>přerušovaná čára zakončená velkým prázdným trojúhelníkem směřujícím k rozhraní</strong> (<code>&lt;|..</code>).</li>
      </ul>

      <h4>Na co si dát pozor (nejčastější chyby)</h4>
      <ul>
        <li><strong>Záměna plné a přerušované čáry:</strong> Dědičnost mezi třídami (včetně abstraktní třídy) používá <strong>plnou čáru</strong> (<code>&lt;|--</code>), zatímco implementace rozhraní používá <strong>přerušovanou čáru</strong> (<code>&lt;|..</code>).</li>
        <li><strong>Opomenutí implementace abstraktní metody v konkrétním potomkovi:</strong> Každá neabstraktní podtřída musí uvést konkrétní implementaci všech zděděných abstraktních metod z nadtřídy i všech metod z realizovaných rozhraní.</li>
        <li><strong>Vkládání běžných instančních atributů do rozhraní:</strong> Rozhraní v Javě reprezentuje čistý kontrakt operací, nikoli stav objektu (na rozdíl od abstraktní třídy).</li>
      </ul>

      <h4>Komentovaný příklad</h4>
      <p>Diagram kombinuje abstraktní nadtřídu a rozhraní na příkladu obdélníku:</p>
      <ul>
        <li><code>Tvar</code> je označen jako abstraktní třída (<code>abstract</code>). Obsahuje atributy <code>-tvarId: String</code> a <code>#rotaceStupne: double</code> a definuje abstraktní metodu <code>{abstract} +vykresli(): void</code>, protože obecný tvar bez určení konkrétní geometrie nelze na plátno nakreslit.</li>
        <li><code>Otacitelny</code> je rozhraní (<code>«interface»</code>), které předepisuje schopnost rotace v rovině prostřednictvím veřejné operace <code>+otoc(uhelStupne: double): void</code>.</li>
        <li>Konkrétní třída <code>Obdelnik</code> dědí z abstraktní třídy <code>Tvar</code> (plná čára s prázdným trojúhelníkem) a zároveň realizuje rozhraní <code>Otacitelny</code> (přerušovaná čára s prázdným trojúhelníkem), čímž se zavazuje implementovat jak metodu <code>vykresli()</code>, tak metodu <code>otoc(...)</code>.</li>
      </ul>
    `,
    exampleDiagram: {
      caption: 'Ukázkový příklad (Geometrie): Abstraktní třída Tvar a rozhraní Otacitelny realizované třídou Obdelnik',
      classes: [
        {
          id: 'ex-t7-tvar',
          name: 'Tvar',
          stereotype: 'abstract',
          isAbstract: true,
          x: 16,
          y: 16,
          attributes: [
            { visibility: '-', name: 'tvarId', type: 'String', isStatic: false },
            { visibility: '#', name: 'rotaceStupne', type: 'double', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'vykresli', params: '', returnType: 'void', isAbstract: true, isStatic: false }
          ]
        },
        {
          id: 'ex-t7-otacitelny',
          name: 'Otacitelny',
          stereotype: 'interface',
          isAbstract: true,
          x: 345,
          y: 16,
          attributes: [],
          methods: [
            { visibility: '+', name: 'otoc', params: 'uhelStupne: double', returnType: 'void', isAbstract: true, isStatic: false }
          ]
        },
        {
          id: 'ex-t7-obdelnik',
          name: 'Obdelnik',
          stereotype: null,
          isAbstract: false,
          x: 170,
          y: 205,
          attributes: [
            { visibility: '-', name: 'sirka', type: 'double', isStatic: false },
            { visibility: '-', name: 'vyska', type: 'double', isStatic: false }
          ],
          methods: [
            { visibility: '+', name: 'vykresli', params: '', returnType: 'void', isAbstract: false, isStatic: false },
            { visibility: '+', name: 'otoc', params: 'uhelStupne: double', returnType: 'void', isAbstract: false, isStatic: false }
          ]
        }
      ],
      relations: [
        {
          id: 'ex-t7-rel-1',
          type: 'generalization',
          sourceId: 'ex-t7-obdelnik',
          targetId: 'ex-t7-tvar'
        },
        {
          id: 'ex-t7-rel-2',
          type: 'realization',
          sourceId: 'ex-t7-obdelnik',
          targetId: 'ex-t7-otacitelny'
        }
      ]
    },
    assignmentHtml: `
      <p>Vytvořte návrhový diagram tříd (UML 2.5) pro jazyk Java obsahující <strong>přesně tři klasifikátory: jednu abstraktní třídu, jedno rozhraní a jednu konkrétní třídu</strong>. Nemodelujte konstruktory ani žádné další nespecifikované prvky.</p>
      <p>Abstraktní třída <strong>Vozidlo</strong> má soukromý atribut (<code>-</code>) <code>vin</code> typu <code>String</code> a chráněný atribut (<code>#</code>) <code>najeteKm</code> typu <code>int</code>. Definuje abstraktní veřejnou bezparametrickou operaci (<code>+</code>, <code>{abstract}</code>) <code>vypoctiZakladniSazbu</code> vracející <code>BigDecimal</code>.</p>
      <p>Rozhraní (interface / <code>«interface»</code>) <strong>Zatizitelny</strong> neobsahuje žádné atributy a deklaruje veřejnou operaci (<code>+</code>) <code>jeNadLimitNosnosti</code> s parametrem <code>aktualniZatizeniKg</code> typu <code>double</code> vracející <code>boolean</code>.</p>
      <p>Konkrétní třída <strong>Dodavka</strong> má soukromý atribut (<code>-</code>) <code>nosnostKg</code> typu <code>double</code> a implementuje obě veřejné operace (<code>+</code>): bezparametrickou operaci <code>vypoctiZakladniSazbu</code> vracející <code>BigDecimal</code> a operaci <code>jeNadLimitNosnosti</code> s parametrem <code>aktualniZatizeniKg</code> typu <code>double</code> vracející <code>boolean</code>.</p>
      <p>Třídu <strong>Dodavka</strong> propojte s abstraktní třídou <strong>Vozidlo</strong> vazbou <strong>generalizace</strong> (plná čára s prázdnou trojúhelníkovou šipkou k <code>Vozidlo</code>) a s rozhraním <strong>Zatizitelny</strong> vazbou <strong>realizace rozhraní</strong> (přerušovaná čára s prázdnou trojúhelníkovou šipkou k <code>Zatizitelny</code>).</p>
    `,
    requirements: [
      'Umístěte na plátno abstraktní třídu <strong>Vozidlo</strong>, rozhraní <strong>Zatizitelny</strong> a konkrétní třídu <strong>Dodavka</strong>.',
      'Propojte <code>Dodavka</code> (zdroj) a <code>Vozidlo</code> (cíl) vazbou <strong>generalizace</strong> (plná čára s prázdným trojúhelníkem).',
      'Propojte <code>Dodavka</code> (zdroj) a rozhraní <code>Zatizitelny</code> (cíl) vazbou <strong>realizace rozhraní</strong> (přerušovaná čára s prázdným trojúhelníkem).'
    ],
    hints: [
      'Dědičnost z abstraktní třídy Vozidlo je plná čára (Generalizace), zatímco implementace rozhraní Zatizitelny je přerušovaná čára (Realizace rozhraní).'
    ],
    classes: [
      {
        id: 't7-vozidlo',
        kind: 'class',
        name: 'Vozidlo',
        isAbstract: true,
        attributes: [
          { visibility: '-', name: 'vin', type: 'String', isStatic: false },
          { visibility: '#', name: 'najeteKm', type: 'int', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'vypoctiZakladniSazbu', params: '', returnType: 'BigDecimal', isAbstract: true, isStatic: false }
        ]
      },
      {
        id: 't7-zatizitelny',
        kind: 'interface',
        name: 'Zatizitelny',
        isAbstract: true,
        attributes: [],
        methods: [
          { visibility: '+', name: 'jeNadLimitNosnosti', params: 'aktualniZatizeniKg: double', returnType: 'boolean', isAbstract: true, isStatic: false }
        ]
      },
      {
        id: 't7-dodavka',
        kind: 'class',
        name: 'Dodavka',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'nosnostKg', type: 'double', isStatic: false }
        ],
        methods: [
          { visibility: '+', name: 'vypoctiZakladniSazbu', params: '', returnType: 'BigDecimal', isAbstract: false, isStatic: false },
          { visibility: '+', name: 'jeNadLimitNosnosti', params: 'aktualniZatizeniKg: double', returnType: 'boolean', isAbstract: false, isStatic: false }
        ]
      }
    ],
    validationRules: {
      counts: { classifiers: 3, relations: 2 },
      expectedClasses: ['t7-vozidlo', 't7-zatizitelny', 't7-dodavka'],
      expectedRelations: [
        {
          id: 'rel-t7-1',
          type: 'generalization',
          sourceId: 't7-dodavka',
          targetId: 't7-vozidlo',
          feedback: {
            wrongType: 'Mezi Dodavka a abstraktní třídou Vozidlo použij generalizaci (plná čára s prázdným trojúhelníkem), nikoli přerušovanou realizaci.',
            wrongDirection: 'Šipka generalizace musí směřovat od potomka (Dodavka) k abstraktní nadtřídě (Vozidlo).'
          }
        },
        {
          id: 'rel-t7-2',
          type: 'realization',
          sourceId: 't7-dodavka',
          targetId: 't7-zatizitelny',
          feedback: {
            wrongType: 'Implementace rozhraní Zatizitelny třídou Dodavka se v UML 2.5 značí realizací rozhraní (přerušovaná čára s prázdným trojúhelníkem), nikoli plnou generalizací.',
            wrongDirection: 'Šipka realizace musí směřovat od implementující třídy (Dodavka) k rozhraní (Zatizitelny).'
          }
        }
      ]
    }
  }
];

export const THEORY_CHAPTER = {
  id: 'teorie',
  type: 'theory',
  order: 1,
  title: 'Základy návrhového diagramu tříd (UML 2.5)',
  subtitle: 'Sedm pilířů objektového modelování',
  badge: 'Pečeť základů UML',
  subchapters: RAW_THEORY_SUBCHAPTERS.map(normalizeTheorySubchapter)
};