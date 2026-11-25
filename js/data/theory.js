/**
 * Datový modul teoretické části: 1 kapitola ('teorie') se 7 podkapitolami ('t1' až 't7').
 * V každé podkapitole používá výklad s ukázkovým diagramem jinou doménu než samostatné zadání,
 * přičemž napříč kapitolou jsou rovnoměrně zastoupeny všechny tři domény (Autoservis, Banka, Geometrie).
 *
 * Sladěno s konvencí návrhového diagramu tříd (UML 2.5) v předmětu UOMO:
 * - Primární terminologie: multiplicita, řiditelnost.
 * - V návrhovém modelu se nepoužívají neorientované ani obousměrné (<-->) asociace ani popisky vazeb.
 * - Každá řiditelná vazba (asociace, agregace, kompozice) je realizována soukromým referenčním atributem
 *   ve zdrojové třídě, jehož název a datový typ (Typ / List<Typ>) přesně odpovídají cílové roli a multiplicitě.
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
  // t2: Asociace a multiplicita (násobnost / kardinalita)
  // Výklad + ukázka: Autoservis | Zadání + validace: Geometrie (Malování)
  // =========================================================================
  {
    id: 't2',
    order: 2,
    title: '1.2 Asociace a multiplicita (násobnost / kardinalita)',
    shortTitle: '1.2 Asociace a multiplicita',
    storyIntro: 'Samotné třídy ještě systém netvoří. V návrhovém modelu je propoj jednosměrnou řiditelnou asociací, nastav přesné multiplicity a nezapomeň na cílovou roli odpovídající referenčnímu atributu.',
    theoryHtml: `
      <h4>Co to je a k čemu to slouží</h4>
      <p><strong>Asociace</strong> vyjadřuje strukturální propojení mezi instancemi dvou tříd, které spolu v systému spolupracují, aniž by jedna třída byla strukturální součástí druhé (nejedná se o vztah celek–část). Zatímco v <em>analytickém modelu</em> se u asociací řiditelnost neřeší (kreslí se neorientovaná čára), v <strong>návrhovém modelu tříd</strong> musí mít každá asociace jednoznačně určenou <strong>jednosměrnou řiditelnost (<code>--&gt;</code>)</strong> a na cílovém konci <strong>roli</strong>.</p>
      <p>V návrhovém modelu pro jazyk Java je každá řiditelná vazba (asociace, agregace i kompozice) realizována <strong>soukromým referenčním atributem ve zdrojové třídě</strong>. Název role na cílovém konci vazby se proto musí přesně shodovat s názvem tohoto referenčního atributu. V návrhovém modelu se rovněž neuvádějí slovní popisky uprostřed čáry, protože význam vztahu jednoznačně vyjadřuje právě cílová role a odpovídající referenční atribut.</p>
      <p><strong>Multiplicita (násobnost / kardinalita)</strong> určuje přesný počet instancí jedné třídy, které mohou být v daný okamžik propojeny s jednou instancí třídy druhé. Při implementaci v Javě přímo rozhoduje o datovém typu referenčního atributu: zda půjde o jednoduchý odkaz (např. <code>-styl: Styl</code> pro <code>0..1</code> nebo <code>1</code>), nebo o kolekci (např. <code>-vozidla: List&lt;Vozidlo&gt;</code> pro <code>0..*</code> nebo <code>1..*</code>).</p>

      <h4>Jak se to zapisuje v UML</h4>
      <ul>
        <li><strong>Grafická notace (návrhový model):</strong> Asociace se zakresluje jako plná čára zakončená <strong>otevřenou šipkou řiditelnosti (<code>--&gt;</code>)</strong> směřující od zdrojové třídy (která drží referenční atribut) k cílové třídě.</li>
        <li><strong>Role na cílovém konci:</strong> U otevřené šipky se uvádí identifikátor role (v konvenci <code>camelCase</code>, bez diakritiky), který odpovídá soukromému referenčnímu atributu ve zdrojové třídě (např. role <code>vozidla</code> odpovídá atributu <code>-vozidla: List&lt;Vozidlo&gt;</code>). Popisky uprostřed čáry se v návrhovém modelu nepíší.</li>
        <li><strong>Zápis multiplicit:</strong> Na oba konce spojovací čáry těsně k okraji příslušné třídy se zapisuje rozsah <code>dolníMez..horníMez</code>. Nejčastější zápisy jsou:
          <ul>
            <li><code>1</code> – právě jedna instance (povinný jednoznačný odkaz, zkrácený zápis pro <code>1..1</code>),</li>
            <li><code>0..1</code> – žádná nebo nejvýše jedna instance (volitelný odkaz, v Javě může být <code>null</code>),</li>
            <li><code>1..*</code> – alespoň jedna až neomezeně mnoho instancí (povinná neprázdná kolekce <code>List&lt;Typ&gt;</code>),</li>
            <li><code>0..*</code> (nebo <code>*</code>) – nula až neomezeně mnoho instancí (volitelná kolekce <code>List&lt;Typ&gt;</code>, může být prázdná).</li>
          </ul>
        </li>
      </ul>

      <h4>Na co si dát pozor (nejčastější chyby)</h4>
      <ul>
        <li><strong>Použití obousměrné (<code>&lt;--&gt;</code>) nebo neorientované asociace:</strong> V návrhovém modelu v UOMO se obousměrná asociace (<code>&lt;--&gt;</code>) ani neorientovaná asociace bez šipky nepoužívá. Každá asociace musí mít jednosměrnou řiditelnost (<code>--&gt;</code>) a cílovou roli.</li>
        <li><strong>Chybějící referenční atribut nebo nesoulad s rolí:</strong> Studenti často napíšou roli u vazby, ale zapomenou uvést odpovídající referenční atribut ve zdrojové třídě – nebo název role neodpovídá názvu atributu. V návrhovém modelu musí název cílové role přesně odpovídat názvu referenčního atributu ve zdrojové třídě.</li>
        <li><strong>Prohození multiplicit na koncích vazby:</strong> Multiplicita se vždy čte směrem od jedné instance protější třídy k cílové třídě. U vazby <code>Zakaznik "1" --&gt; "1..* vozidla" Vozidlo</code> znamená <code>1..*</code> u vozidla, že jeden zákazník vlastní jedno až mnoho vozidel, zatímco <code>1</code> u zákazníka znamená, že jedno vozidlo patří právě jednomu zákazníkovi.</li>
        <li><strong>Opomenutí multiplicit:</strong> V návrhovém diagramu musí být multiplicita přesně stanovena na obou stranách každé asociace.</li>
      </ul>

      <h4>Komentovaný příklad</h4>
      <p>Diagram propojuje třídy <code>Zakaznik</code> a <code>Vozidlo</code> jednosměrnou řiditelnou asociací:</p>
      <ul>
        <li>Zdrojová třída <code>Zakaznik</code> obsahuje soukromý referenční atribut <code>-vozidla: List&lt;Vozidlo&gt;</code>, který realizuje vazbu na cílovou třídu <code>Vozidlo</code>.</li>
        <li>Na cílové straně <code>Vozidlo</code> je otevřená šipka řiditelnosti, multiplicita <code>1..*</code> (zákazník vlastní alespoň jedno vozidlo, proto má atribut typ kolekce <code>List&lt;Vozidlo&gt;</code>) a role <code>vozidla</code> shodná s názvem referenčního atributu.</li>
        <li>Na straně <code>Zakaznik</code> je uvedena multiplicita <code>1</code> (každé vozidlo patří právě jednomu zákazníkovi), avšak třída <code>Vozidlo</code> nedrží zpětný odkaz na zákazníka.</li>
      </ul>
    `,
    exampleDiagram: {
      caption: 'Ukázkový příklad (Autoservis): Jednosměrná řiditelná asociace Zakaznik (1) ──> (1..* vozidla) Vozidlo s referenčním atributem',
      classes: [
        {
          id: 'ex-t2-zakaznik',
          name: 'Zakaznik',
          stereotype: null,
          isAbstract: false,
          x: 16,
          y: 28,
          attributes: [
            { visibility: '-', name: 'zakaznikId', type: 'String', isStatic: false },
            { visibility: '-', name: 'prijmeni', type: 'String', isStatic: false },
            { visibility: '-', name: 'vozidla', type: 'List<Vozidlo>', isStatic: false }
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
          x: 385,
          y: 28,
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
          navigability: 'unidirectional',
          sourceId: 'ex-t2-zakaznik',
          targetId: 'ex-t2-vozidlo',
          sourceMultiplicity: '1',
          targetMultiplicity: '1..*',
          targetRole: 'vozidla'
        }
      ]
    },
    assignmentHtml: `
      <p>Vytvořte návrhový diagram tříd (UML 2.5) pro jazyk Java obsahující <strong>přesně dvě konkrétní třídy propojené jednou jednosměrnou řiditelnou asociací</strong>. Vazba je ve zdrojové třídě realizována soukromým referenčním atributem, jehož název odpovídá cílové roli; nemodelujte konstruktory ani další nespecifikované prvky.</p>
      <p>Třída <strong>Tvar</strong> eviduje soukromý atribut (<code>-</code>) <code>tvarId</code> typu <code>String</code>, soukromý referenční atribut (<code>-</code>) <code>styl</code> typu <code>Styl</code> a poskytuje veřejnou operaci (<code>+</code>) <code>priradStyl</code> s parametrem <code>styl</code> typu <code>Styl</code> a návratovým typem <code>void</code>.</p>
      <p>Třída <strong>Styl</strong> eviduje soukromé atributy (<code>-</code>) <code>stylId</code> typu <code>String</code> a <code>barvaVyplne</code> typu <code>String</code>. Poskytuje veřejnou operaci (<code>+</code>) <code>zmenBarvuVyplne</code> s parametrem <code>hexBarva</code> typu <code>String</code> a návratovým typem <code>boolean</code>.</p>
      <p>Třídy <strong>Tvar</strong> a <strong>Styl</strong> propojte <strong>jednosměrnou řiditelnou asociací</strong> směřující z <code>Tvar</code> na <code>Styl</code> (otevřená šipka u <code>Styl</code>). Jeden styl může používat libovolný počet tvarů nebo žádný (multiplicita <code>0..*</code> na straně <code>Tvar</code>) a každý tvar může mít přiřazen nejvýše jeden styl nebo žádný (multiplicita <code>0..1</code> a role <code>styl</code> na straně <code>Styl</code>, odpovídající referenčnímu atributu <code>-styl: Styl</code> ve třídě <code>Tvar</code>).</p>
    `,
    requirements: [
      'Umístěte na plátno třídy <strong>Tvar</strong> (včetně referenčního atributu <code>-styl: Styl</code>) a <strong>Styl</strong>.',
      'Propojte je <strong>jednosměrnou řiditelnou asociací</strong> směřující z <code>Tvar</code> na <code>Styl</code> (otevřená šipka u <code>Styl</code>).',
      'Nastavte multiplicitu <code>0..*</code> na straně <code>Tvar</code> a multiplicitu <code>0..1</code> s rolí <code>styl</code> na straně <code>Styl</code>.'
    ],
    hints: [
      'V návrhovém modelu zvolte „Jednosměrná asociace (řiditelná)“ směřující z Tvar na Styl. Multiplicita u Tvar je 0..*, u Styl je 0..1 a role u cíle je styl (shodně s referenčním atributem -styl: Styl).'
    ],
    classes: [
      {
        id: 't2-tvar',
        kind: 'class',
        name: 'Tvar',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'tvarId', type: 'String', isStatic: false },
          { visibility: '-', name: 'styl', type: 'Styl', isStatic: false }
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
          navigability: 'unidirectional',
          sourceId: 't2-tvar',
          sourceMultiplicity: '0..*',
          sourceRole: null,
          targetId: 't2-styl',
          targetMultiplicity: '0..1',
          targetRole: 'styl',
          feedback: {
            wrongType: 'V návrhovém modelu v UOMO použij mezi třídami Tvar a Styl jednosměrnou řiditelnou asociaci (otevřená šipka u Styl), nikoli obousměrnou asociaci (<-->).',
            wrongDirection: 'Jednosměrná asociace mezi Tvar a Styl má obrácený směr – otevřená šipka řiditelnosti musí směřovat od Tvar k Styl (třída Tvar drží referenční atribut styl).',
            wrongSourceMultiplicity: 'U vazby Tvar → Styl zkontroluj multiplicitu na straně Tvar (jeden styl může používat 0 až libovolný počet tvarů: 0..*).',
            wrongTargetMultiplicity: 'U vazby Tvar → Styl zkontroluj multiplicitu na straně Styl (tvar používá nejvýše jeden styl nebo žádný: 0..1).',
            wrongTargetRole: 'U vazby Tvar → Styl uveď na cílové straně Styl roli „styl“, která odpovídá referenčnímu atributu -styl: Styl ve třídě Tvar.'
          }
        }
      ]
    }
  },

  // =========================================================================
  // t3: Řiditelnost (navigovatelnost) asociace, role a referenční atributy
  // Výklad + ukázka: Geometrie (Malování) | Zadání + validace: Banka
  // =========================================================================
  {
    id: 't3',
    order: 3,
    title: '1.3 Řiditelnost (navigovatelnost) asociace, role a referenční atributy',
    shortTitle: '1.3 Řiditelnost a role',
    storyIntro: 'Otevřená šipka řiditelnosti určuje směr odkazu v paměti a cílová role musí vždy přesně odpovídat soukromému referenčnímu atributu ve zdrojové třídě.',
    theoryHtml: `
      <h4>Co to je a k čemu to slouží</h4>
      <p><strong>Řiditelnost (navigovatelnost)</strong> určuje, ze které třídy na kterou lze za běhu programu přistupovat pomocí uložené reference. V návrhovém modelu podle pravidel UOMO je každá asociace <strong>jednosměrně řiditelná</strong> – minimalizují se tak cyklické závislosti a zjednodušuje se správa konzistence objektů v paměti. Pokud <code>Platno</code> potřebuje vědět, který <code>Tvar</code> je aktuálně označený, ale <code>Tvar</code> nepotřebuje znát odkaz na plátno, vedeme šipku řiditelnosti výhradně z <code>Platno</code> na <code>Tvar</code>.</p>
      <p><strong>Role a referenční atribut</strong> tvoří v návrhovém modelu neoddělitelnou dvojici. Každá řiditelná vazba je v kódu jazyka Java realizována <strong>soukromým referenčním atributem</strong> ve zdrojové třídě a <strong>název role</strong> u cílové šipky musí ukazovat právě na tento atribut. V návrhovém modelu se proto na čáru nepíší popisky asociace – význam vztahu je zcela jasný z role a referenčního atributu.</p>

      <h4>Jak se to zapisuje v UML</h4>
      <ul>
        <li><strong>Jednosměrná řiditelnost:</strong> Zapisuje se jako plná čára zakončená <strong>otevřenou šipkou (<code>--&gt;</code>)</strong> na straně cílové třídy. Zdrojová třída na opačném konci (bez šipky) drží soukromý referenční atribut na cíl, zatímco cílová třída zpětný odkaz neudržuje.</li>
        <li><strong>Vztah role a referenčního atributu:</strong> U otevřené šipky (cílového konce) se zapíše název role v konvenci <code>camelCase</code> (bez diakritiky) a ve zdrojové třídě se uvede soukromý atribut shodného jména:
          <ul>
            <li>pro cílovou multiplicitu <code>1</code> nebo <code>0..1</code> má referenční atribut typ cílové třídy (např. <code>-oznacenyTvar: Tvar</code>, <code>-kotevniBod: Bod</code>),</li>
            <li>pro cílovou multiplicitu <code>0..*</code> nebo <code>1..*</code> má referenční atribut typ kolekce (např. <code>-transakce: List&lt;Transakce&gt;</code>).</li>
          </ul>
        </li>
      </ul>

      <h4>Na co si dát pozor (nejčastější chyby)</h4>
      <ul>
        <li><strong>Opačný směr šipky řiditelnosti:</strong> Šipka ukazuje od třídy, která obsahuje referenční atribut, ke třídě, na kterou je odkazováno. Pokud třída <code>Tvar</code> obsahuje <code>-kotevniBod: Bod</code>, šipka musí směřovat z <code>Tvar</code> na <code>Bod</code>, nikoli naopak.</li>
        <li><strong>Obousměrná řiditelnost (<code>&lt;--&gt;</code>):</strong> Obousměrně řiditelná asociace se značí otevřenými šipkami na obou koncích a vyžadovala by vzájemně synchronizované referenční atributy v obou třídách – v návrhovém modelu v UOMO se nepoužívá.</li>
        <li><strong>Záměna otevřené asociační šipky za šipku dědičnosti:</strong> Řiditelnost asociace používá jednoduchou otevřenou šipku (<code>--&gt;</code>), zatímco generalizace (dědičnost) používá uzavřený prázdný trojúhelník (<code>--|&gt;</code>).</li>
        <li><strong>Nesoulad názvu role a referenčního atributu:</strong> Pokud je ve třídě atribut <code>-kotevniBod: Bod</code>, cílová role musí být přesně <code>kotevniBod</code> (nikoli např. <code>bod</code>).</li>
      </ul>

      <h4>Komentovaný příklad</h4>
      <p>Diagram ukazuje řetězec dvou jednosměrných řiditelných asociací mezi třemi třídami včetně realizujících referenčních atributů:</p>
      <ul>
        <li><strong>Platno → Tvar:</strong> Zdrojová třída <code>Platno</code> obsahuje soukromý referenční atribut <code>-oznacenyTvar: Tvar</code>. Otevřená šipka u třídy <code>Tvar</code> s rolí <code>oznacenyTvar</code> a multiplicitami <code>0..1</code> na obou stranách určuje, že plátno si pamatuje nejvýše jeden vybraný tvar (při neoznačení je hodnota <code>null</code>).</li>
        <li><strong>Tvar → Bod:</strong> Zdrojová třída <code>Tvar</code> obsahuje soukromý referenční atribut <code>-kotevniBod: Bod</code>. Jednosměrná vazba s rolí <code>kotevniBod</code> a multiplicitami <code>1</code> na obou stranách vyjadřuje, že každý tvar drží přímý odkaz na svůj referenční bod, ale bod o tvaru neví.</li>
      </ul>
    `,
    exampleDiagram: {
      caption: 'Ukázkový příklad (Geometrie): Řetězec dvou jednosměrných řiditelných asociací s rolemi a referenčními atributy',
      classes: [
        {
          id: 'ex-t3-platno',
          name: 'Platno',
          stereotype: null,
          isAbstract: false,
          x: 16,
          y: 26,
          attributes: [
            { visibility: '-', name: 'nazev', type: 'String', isStatic: false },
            { visibility: '-', name: 'oznacenyTvar', type: 'Tvar', isStatic: false }
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
          x: 385,
          y: 26,
          attributes: [
            { visibility: '-', name: 'tvarId', type: 'String', isStatic: false },
            { visibility: '-', name: 'kotevniBod', type: 'Bod', isStatic: false }
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
          x: 385,
          y: 225,
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
          targetRole: 'oznacenyTvar'
        },
        {
          id: 'ex-t3-rel-2',
          type: 'association',
          navigability: 'unidirectional',
          sourceId: 'ex-t3-tvar',
          targetId: 'ex-t3-bod',
          sourceMultiplicity: '1',
          targetMultiplicity: '1',
          targetRole: 'kotevniBod'
        }
      ]
    },
    assignmentHtml: `
      <p>Vytvořte návrhový diagram tříd (UML 2.5) pro jazyk Java obsahující <strong>přesně tři konkrétní třídy propojené dvěma jednosměrnými řiditelnými asociacemi se zadanými rolemi</strong>. Každá vazba je realizována soukromým referenčním atributem ve zdrojové třídě, na který ukazuje cílová role; nemodelujte konstruktory ani další nespecifikované prvky.</p>
      <p>Třída <strong>BankovniUcet</strong> má soukromý atribut (<code>-</code>) <code>cisloUctu</code> typu <code>String</code>, soukromý referenční atribut (<code>-</code>) <code>transakce</code> typu <code>List&lt;Transakce&gt;</code> a veřejnou operaci (<code>+</code>) <code>vloz</code> s parametrem <code>castka</code> typu <code>BigDecimal</code> vracející <code>boolean</code>.</p>
      <p>Třída <strong>Transakce</strong> má soukromé atributy (<code>-</code>) <code>transakceId</code> typu <code>String</code> a <code>castka</code> typu <code>BigDecimal</code>, soukromý referenční atribut (<code>-</code>) <code>pouzitaKarta</code> typu <code>PlatebniKarta</code> a veřejnou bezparametrickou operaci (<code>+</code>) <code>jeKaretniTransakce</code> vracející <code>boolean</code>.</p>
      <p>Třída <strong>PlatebniKarta</strong> má soukromý atribut (<code>-</code>) <code>cisloKarty</code> typu <code>String</code> a veřejnou operaci (<code>+</code>) <code>overPin</code> s parametrem <code>zadanyPin</code> typu <code>String</code> vracející <code>boolean</code>.</p>
      <ul>
        <li>Mezi třídami <strong>BankovniUcet</strong> a <strong>Transakce</strong> vytvořte jednosměrnou řiditelnou asociaci směřující z <code>BankovniUcet</code> na <code>Transakce</code> (otevřená šipka u <code>Transakce</code>). Na straně <code>BankovniUcet</code> uveďte multiplicitu <code>1</code>, na straně <code>Transakce</code> uveďte multiplicitu <code>0..*</code> a roli <code>transakce</code> (odpovídající atributu <code>-transakce: List&lt;Transakce&gt;</code>).</li>
        <li>Mezi třídami <strong>Transakce</strong> a <strong>PlatebniKarta</strong> vytvořte jednosměrnou řiditelnou asociaci směřující z <code>Transakce</code> na <code>PlatebniKarta</code> (otevřená šipka u <code>PlatebniKarta</code>). Na straně <code>Transakce</code> uveďte multiplicitu <code>0..*</code>, na straně <code>PlatebniKarta</code> uveďte multiplicitu <code>0..1</code> a roli <code>pouzitaKarta</code> (odpovídající atributu <code>-pouzitaKarta: PlatebniKarta</code>).</li>
      </ul>
    `,
    requirements: [
      'Umístěte na plátno třídy <strong>BankovniUcet</strong> (s atributem <code>-transakce: List&lt;Transakce&gt;</code>), <strong>Transakce</strong> (s atributem <code>-pouzitaKarta: PlatebniKarta</code>) a <strong>PlatebniKarta</strong>.',
      'Vytvořte jednosměrnou řiditelnou asociaci <code>BankovniUcet (1)</code> → <code>Transakce (0..*, role: transakce)</code>.',
      'Vytvořte jednosměrnou řiditelnou asociaci <code>Transakce (0..*)</code> → <code>PlatebniKarta (0..1, role: pouzitaKarta)</code>.'
    ],
    hints: [
      'Šipka řiditelnosti směřuje od třídy obsahující referenční atribut k cílové třídě: BankovniUcet → Transakce (role transakce) a Transakce → PlatebniKarta (role pouzitaKarta).'
    ],
    classes: [
      {
        id: 't3-ucet',
        kind: 'class',
        name: 'BankovniUcet',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'cisloUctu', type: 'String', isStatic: false },
          { visibility: '-', name: 'transakce', type: 'List<Transakce>', isStatic: false }
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
          { visibility: '-', name: 'castka', type: 'BigDecimal', isStatic: false },
          { visibility: '-', name: 'pouzitaKarta', type: 'PlatebniKarta', isStatic: false }
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
          feedback: {
            wrongTargetRole: 'U jednosměrné asociace BankovniUcet → Transakce zkontroluj název role u cílové třídy Transakce – musí odpovídat referenčnímu atributu -transakce: List<Transakce> (má být „transakce“).'
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
          feedback: {
            wrongTargetMultiplicity: 'U vazby Transakce → PlatebniKarta nastav multiplicitu na straně PlatebniKarta na „0..1“ (bezhotovostní převod kartu nepoužívá).',
            wrongTargetRole: 'U jednosměrné asociace Transakce → PlatebniKarta zkontroluj název role u cílové třídy PlatebniKarta – musí odpovídat referenčnímu atributu -pouzitaKarta: PlatebniKarta (má být „pouzitaKarta“).'
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
      <p>V návrhovém modelu pomáhá agregace odlišit pouhé organizační seskupení sdílených nebo samostatně existujících entit od striktního vlastnictví životního cyklu (kompozice). Stejně jako běžná asociace má jednosměrnou řiditelnost od celku k části a je realizována soukromým referenčním atributem ve třídě celku.</p>

      <h4>Jak se to zapisuje v UML</h4>
      <ul>
        <li><strong>Grafická notace:</strong> Agregace se zakresluje jako jednosměrná řiditelná vazba zakončená <strong>prázdným (nevyplněným) kosočtvercem na straně celku</strong> a otevřenou šipkou řiditelnosti na straně části (<code>o--&gt;</code>).</li>
        <li><strong>Multiplicity, role a referenční atribut:</strong> Na straně celku (u prázdného kosočtverce) bývá multiplicita nejčastěji <code>0..1</code> (část nemusí být v daný okamžik přiřazena k žádnému celku, případně je v jednom celku) nebo <code>0..*</code> (pokud může být stejná část sdílena více celky současně). Na straně části se uvádí odpovídající multiplicita (<code>0..*</code>, <code>1..*</code> apod.) a název role kolekce shodný se soukromým referenčním atributem ve třídě celku.</li>
      </ul>

      <h4>Na co si dát pozor (nejčastější chyby)</h4>
      <ul>
        <li><strong>Umístění kosočtverce na špatný konec vazby:</strong> Kosočtverec patří vždy na stranu celku (nadřazeného kontejneru), nikoli na stranu části.</li>
        <li><strong>Záměna agregace a kompozice:</strong> Pokud zánik celku automaticky znamená smazání všech částí (např. smazání zakázky smaže její řádky), nejde o agregaci, ale o kompozici.</li>
        <li><strong>Multiplicita 1 na straně celku u agregace:</strong> Pokud by část mohla existovat výhradně v rámci právě jednoho celku (<code>1</code>), v praxi jde téměř vždy o kompozici. Pro agregaci je typická volitelná příslušnost (<code>0..1</code>) nebo sdílení (<code>0..*</code>).</li>
      </ul>

      <h4>Komentovaný příklad</h4>
      <p>Diagram zachycuje organizační vztah mezi třídou <code>Pobocka</code> (celek) a třídou <code>Klient</code> (část) pomocí jednosměrné řiditelné agregace:</p>
      <ul>
        <li>Prázdný kosočtverec u třídy <code>Pobocka</code> a její soukromý referenční atribut <code>-kmenoviKlienti: List&lt;Klient&gt;</code> značí, že pobočka sdružuje své kmenové klienty (cílová role <code>kmenoviKlienti</code>, multiplicita <code>0..*</code>).</li>
        <li>Multiplicita <code>0..1</code> na straně pobočky vyjadřuje, že klient spadá nejvýše pod jednu kmenovou pobočku, ale může v systému existovat i bez přiřazené pobočky (např. čistě digitální klient).</li>
        <li>Pokud banka konkrétní pobočku zruší, záznamy klientů v systému nezanikají – klienti si uchovávají své účty a mohou být převedeni pod jinou pobočku.</li>
      </ul>
    `,
    exampleDiagram: {
      caption: 'Ukázkový příklad (Banka): Jednosměrná řiditelná agregace Pobocka (0..1) ◇──> (0..* kmenoviKlienti) Klient',
      classes: [
        {
          id: 'ex-t4-pobocka',
          name: 'Pobocka',
          stereotype: null,
          isAbstract: false,
          x: 16,
          y: 28,
          attributes: [
            { visibility: '-', name: 'kodPobocky', type: 'String', isStatic: false },
            { visibility: '-', name: 'mesto', type: 'String', isStatic: false },
            { visibility: '-', name: 'kmenoviKlienti', type: 'List<Klient>', isStatic: false }
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
          x: 395,
          y: 28,
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
          targetRole: 'kmenoviKlienti'
        }
      ]
    },
    assignmentHtml: `
      <p>Vytvořte návrhový diagram tříd (UML 2.5) pro jazyk Java obsahující <strong>přesně dvě konkrétní třídy propojené jednou jednosměrnou řiditelnou agregací</strong>. Vazba je realizována soukromým referenčním atributem ve třídě celku; nemodelujte konstruktory ani další nespecifikované prvky.</p>
      <p>Třída <strong>Paleta</strong> eviduje soukromý atribut (<code>-</code>) <code>nazev</code> typu <code>String</code>, soukromý referenční atribut (<code>-</code>) <code>styly</code> typu <code>List&lt;Styl&gt;</code> a nabízí veřejnou operaci (<code>+</code>) <code>pridejStyl</code> s parametrem <code>styl</code> typu <code>Styl</code> a návratovým typem <code>void</code>.</p>
      <p>Třída <strong>Styl</strong> eviduje soukromé atributy (<code>-</code>) <code>stylId</code> typu <code>String</code> a <code>barvaVyplne</code> typu <code>String</code>. Nabízí veřejnou operaci (<code>+</code>) <code>zmenBarvuVyplne</code> s parametrem <code>hexBarva</code> typu <code>String</code> a návratovým typem <code>boolean</code>.</p>
      <p>Paleta sdružuje styly jako <strong>slabá vazba celek–část s nezávislým životním cyklem</strong> (při smazání palety styly v systému nadále zůstávají). Modelujte <strong>jednosměrnou řiditelnou agregaci</strong> z celku <code>Paleta</code> (prázdný kosočtverec u <code>Paleta</code>) k části <code>Styl</code> (šipka řiditelnosti u <code>Styl</code>). Na straně <code>Paleta</code> uveďte multiplicitu <code>0..1</code>, na straně <code>Styl</code> uveďte multiplicitu <code>0..*</code> a roli <code>styly</code> (odpovídající referenčnímu atributu <code>-styly: List&lt;Styl&gt;</code>).</p>
    `,
    requirements: [
      'Umístěte na plátno třídy <strong>Paleta</strong> (s referenčním atributem <code>-styly: List&lt;Styl&gt;</code>) a <strong>Styl</strong>.',
      'Propojte je <strong>jednosměrnou řiditelnou agregací</strong> (prázdný kosočtverec u <code>Paleta</code>, otevřená šipka u <code>Styl</code>).',
      'Nastavte multiplicitu <code>0..1</code> u <code>Paleta</code> a multiplicitu <code>0..*</code> s rolí <code>styly</code> u <code>Styl</code>.'
    ],
    hints: [
      'Styly přežijí i smazání palety – použijte jednosměrnou agregaci (prázdný kosočtverec u celku Paleta) s multiplicitou 0..1 u Paleta a 0..* (role styly odpovídající -styly: List<Styl>) u Styl.'
    ],
    classes: [
      {
        id: 't4-paleta',
        kind: 'class',
        name: 'Paleta',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'nazev', type: 'String', isStatic: false },
          { visibility: '-', name: 'styly', type: 'List<Styl>', isStatic: false }
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
          feedback: {
            wrongType: 'Mezi třídami Paleta a Styl jde o slabý vztah celek–část s nezávislým životním cyklem – použij jednosměrnou agregaci (prázdný kosočtverec), nikoli kompozici.',
            wrongSourceMultiplicity: 'Na straně celku Paleta nastav multiplicitu „0..1“ (styl může existovat i mimo jakoukoli paletu).',
            wrongTargetRole: 'Na straně části Styl uveď název role „styly“ odpovídající referenčnímu atributu -styly: List<Styl> ve třídě Paleta.'
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
      <p>V návrhovém modelu a při implementaci v Javě kompozice přímo určuje odpovědnost za vytváření a rušení objektů (kaskádové mazání a uvolňování v paměti) a je ve třídě celku realizována soukromým referenčním atributem (kolekcí či jedním odkazem).</p>

      <h4>Jak se to zapisuje v UML</h4>
      <ul>
        <li><strong>Grafická notace:</strong> Kompozice se zakresluje jako jednosměrná řiditelná vazba zakončená <strong>plným (černě vyplněným) kosočtvercem na straně celku</strong> a otevřenou šipkou řiditelnosti na straně části (<code>*--&gt;</code>).</li>
        <li><strong>Multiplicity, role a referenční atribut:</strong> Na straně celku (u plného kosočtverce) je multiplicita vždy <code>1</code> (nebo výjimečně <code>0..1</code>, pokud může být daný typ části volitelně vlastněn jiným typem celku, nikdy však <code>*</code>). Na straně části se uvádí multiplicita podle doménových pravidel (<code>1</code>, <code>0..1</code>, <code>1..*</code>, <code>0..*</code>) a název role shodný se soukromým referenčním atributem ve třídě celku.</li>
      </ul>

      <h4>Na co si dát pozor (nejčastější chyby)</h4>
      <ul>
        <li><strong>Multiplicita * nebo 1..* na straně plného kosočtverce:</strong> Protože kompozice zakazuje sdílení jedné instance části mezi více celky současně, multiplicita na straně celku nesmí být nikdy větší než <code>1</code>.</li>
        <li><strong>Nadužívání kompozice tam, kde jde o běžnou asociaci:</strong> Například mezi <code>Platno</code> a označeným <code>Tvar</code> není kompozice (zrušením označení tvar nezaniká), zatímco mezi <code>Platno</code> a <code>Vrstva</code> kompozice je.</li>
      </ul>

      <h4>Komentovaný příklad</h4>
      <p>Diagram modeluje strukturální vztah mezi třídou <code>Platno</code> (celek) a třídou <code>Vrstva</code> (část) pomocí jednosměrné řiditelné kompozice:</p>
      <ul>
        <li>Plný kosočtverec u třídy <code>Platno</code> s multiplicitou <code>1</code> vyjadřuje, že každá kreslicí vrstva je neoddělitelnou součástí právě jednoho plátna, nemůže existovat samostatně a při zavření či odstranění plátna zanikají i všechny jeho vrstvy.</li>
        <li>Multiplicita <code>1..*</code> a role <code>vrstvy</code> na straně třídy <code>Vrstva</code> odpovídají soukromému referenčnímu atributu <code>-vrstvy: List&lt;Vrstva&gt;</code> ve třídě <code>Platno</code> a určují, že každé plátno obsahuje alespoň jednu vrstvu.</li>
      </ul>
    `,
    exampleDiagram: {
      caption: 'Ukázkový příklad (Geometrie): Jednosměrná řiditelná kompozice Platno (1) ◆──> (1..* vrstvy) Vrstva',
      classes: [
        {
          id: 'ex-t5-platno',
          name: 'Platno',
          stereotype: null,
          isAbstract: false,
          x: 16,
          y: 28,
          attributes: [
            { visibility: '-', name: 'nazev', type: 'String', isStatic: false },
            { visibility: '-', name: 'vrstvy', type: 'List<Vrstva>', isStatic: false }
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
          x: 385,
          y: 28,
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
          targetRole: 'vrstvy'
        }
      ]
    },
    assignmentHtml: `
      <p>Vytvořte návrhový diagram tříd (UML 2.5) pro jazyk Java obsahující <strong>přesně dvě konkrétní třídy propojené jednou jednosměrnou řiditelnou kompozicí</strong>. Vazba je realizována soukromým referenčním atributem ve třídě celku; nemodelujte konstruktory ani další nespecifikované prvky.</p>
      <p>Třída <strong>ServisniZakazka</strong> eviduje soukromé atributy (<code>-</code>) <code>cisloZakazky</code> typu <code>String</code> a <code>stav</code> typu <code>String</code>, soukromý referenční atribut (<code>-</code>) <code>polozky</code> typu <code>List&lt;PolozkaZakazky&gt;</code> a nabízí veřejnou operaci (<code>+</code>) <code>pridejPolozku</code> s parametrem <code>polozka</code> typu <code>PolozkaZakazky</code> a návratovým typem <code>void</code>.</p>
      <p>Třída <strong>PolozkaZakazky</strong> eviduje soukromé atributy (<code>-</code>) <code>polozkaId</code> typu <code>String</code> a <code>popis</code> typu <code>String</code>. Nabízí veřejnou bezparametrickou operaci (<code>+</code>) <code>vypoctiMezisoucet</code> s návratovým typem <code>BigDecimal</code>.</p>
      <p>Položka zakázky je <strong>existenčně závislou součástí servisní zakázky</strong> a při zrušení zakázky zanikají všechny její položky. Modelujte <strong>jednosměrnou řiditelnou kompozici</strong> z celku <code>ServisniZakazka</code> (plný kosočtverec u <code>ServisniZakazka</code>) k části <code>PolozkaZakazky</code> (šipka řiditelnosti u <code>PolozkaZakazky</code>). Na straně <code>ServisniZakazka</code> uveďte multiplicitu <code>1</code>, na straně <code>PolozkaZakazky</code> uveďte multiplicitu <code>1..*</code> a roli <code>polozky</code> (odpovídající referenčnímu atributu <code>-polozky: List&lt;PolozkaZakazky&gt;</code>).</p>
    `,
    requirements: [
      'Umístěte na plátno třídy <strong>ServisniZakazka</strong> (s referenčním atributem <code>-polozky: List&lt;PolozkaZakazky&gt;</code>) a <strong>PolozkaZakazky</strong>.',
      'Propojte je <strong>jednosměrnou řiditelnou kompozicí</strong> (plný kosočtverec u <code>ServisniZakazka</code>, otevřená šipka u <code>PolozkaZakazky</code>).',
      'Nastavte multiplicitu <code>1</code> u <code>ServisniZakazka</code> a multiplicitu <code>1..*</code> s rolí <code>polozky</code> u <code>PolozkaZakazky</code>.'
    ],
    hints: [
      'Plný kosočtverec kompozice patří vždy na stranu celku (ServisniZakazka), multiplicita u něj musí být přesně 1 a cílová role polozky odpovídá atributu -polozky: List<PolozkaZakazky>.'
    ],
    classes: [
      {
        id: 't5-zakazka',
        kind: 'class',
        name: 'ServisniZakazka',
        isAbstract: false,
        attributes: [
          { visibility: '-', name: 'cisloZakazky', type: 'String', isStatic: false },
          { visibility: '-', name: 'stav', type: 'String', isStatic: false },
          { visibility: '-', name: 'polozky', type: 'List<PolozkaZakazky>', isStatic: false }
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
          feedback: {
            wrongType: 'Položka zakázky nemůže existovat bez své servisní zakázky – použij jednosměrnou kompozici (plný kosočtverec), nikoli agregaci.',
            wrongSourceMultiplicity: 'U kompozice mezi ServisniZakazka a PolozkaZakazky musí být na straně celku (ServisniZakazka) multiplicita „1“.',
            wrongTargetRole: 'Na straně části PolozkaZakazky uveď název role „polozky“ odpovídající referenčnímu atributu -polozky: List<PolozkaZakazky> ve třídě ServisniZakazka.'
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
    storyIntro: 'Společné vlastnosti a operace přesuň do nadtřídy a pamatuj: prázdný trojúhelník dědičnosti vždy míří od potomka k rodiči a nikdy na něj nepatří multiplicity ani role.',
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
        <li><strong>Bez multiplicit a rolí:</strong> Na čáře generalizace se nikdy neuvádějí multiplicity ani role, protože nejde o vazbu mezi dvěma objekty, ale o vztah mezi dvěma třídami v typovém systému.</li>
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
      'Vytvořte vazbu <strong>generalizace</strong> od potomka <code>BeznyUcet</code> (zdroj) k rodiči <code>BankovniUcet</code> (cíl) bez multiplicit a rolí.',
      'Vytvořte vazbu <strong>generalizace</strong> od potomka <code>SporiciUcet</code> (zdroj) k rodiči <code>BankovniUcet</code> (cíl) bez multiplicit a rolí.'
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
