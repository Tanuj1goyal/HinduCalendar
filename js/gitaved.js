/**
 * gitaved.js — Bhagavad Gita & Four Vedas Chapter Reader
 * Kurukshetra Panchang | कुरुक्षेत्र पंचांग
 *
 * Provides scripture data and reader UI logic.
 * Scripture data is self-contained in this file (SCRIPTURES array).
 */

'use strict';

/* ══════════════════════════════════════════
   SCRIPTURE DATA
   ══════════════════════════════════════════ */
var SCRIPTURES = [
  {
    id: 'gita', nameHi: 'श्रीमद्भगवद्गीता', nameEn: 'Bhagavad Gita',
    icon: '📿', badge: 'badge-gita', badgeTxt: '18 अध्याय',
    desc: 'कुरुक्षेत्र में श्रीकृष्ण द्वारा अर्जुन को दिया गया दिव्य उपदेश — 700 श्लोक। विश्व का सर्वाधिक पढ़ा जाने वाला ग्रन्थ।',
    audioPath: 'audio/gita/',
    chapters: [
      { num:1,  hi:'अर्जुन विषाद योग',            en:'Arjuna Vishada Yoga',            shlokas:47,
        purpose:'युद्धभूमि में अर्जुन का मोह और विषाद। यह अध्याय बताता है कि कर्तव्य के सामने मोहग्रस्त होने पर मनुष्य की क्या दशा होती है। प्रयोजन: स्वयं की कमज़ोरी को पहचानना ही साधना का प्रथम चरण है।',
        shlokaData:[
          {num:'१.१',  text:'धृतराष्ट्र उवाच।\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥', meaning:'धृतराष्ट्र ने कहा — हे सञ्जय! धर्मभूमि कुरुक्षेत्र में एकत्र हुए मेरे और पाण्डवों के पुत्रों ने क्या किया?'},
          {num:'१.४७', text:'एवमुक्त्वार्जुनः सङ्ख्ये रथोपस्थ उपाविशत्।\nविसृज्य सशरं चापं शोकसंविग्नमानसः॥', meaning:'इस प्रकार कहकर अर्जुन युद्धभूमि में रथ पर बैठ गया। उसने बाण सहित धनुष छोड़ दिया — मन शोक से व्याकुल था।'}
        ]},
      { num:2,  hi:'साङ्ख्य योग',                  en:'Sankhya Yoga',                  shlokas:72,
        purpose:'आत्मा की अमरता और कर्तव्य का ज्ञान। गीता का सार यहाँ है। प्रयोजन: मृत्यु-भय और मोह से मुक्ति। "नैनं छिन्दन्ति शस्त्राणि" — यहाँ है।',
        shlokaData:[
          {num:'२.१९', text:'य एनं वेत्ति हन्तारं यश्चैनं मन्यते हतम्।\nउभौ तौ न विजानीतो नायं हन्ति न हन्यते॥', meaning:'जो इसे (आत्मा को) मारने वाला समझता है और जो इसे मरा हुआ मानता है, दोनों नहीं जानते। यह न मारती है, न मारी जाती है।'},
          {num:'२.४७', text:'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥', meaning:'तेरा अधिकार केवल कर्म में है, फल में कभी नहीं। कर्म के फल का कारण मत बन। (गीता का सबसे प्रसिद्ध श्लोक)'}
        ]},
      { num:3,  hi:'कर्म योग',                     en:'Karma Yoga',                    shlokas:43,
        purpose:'निष्काम कर्म — फल की चाह छोड़कर कर्म। प्रयोजन: सांसारिक जीवन में धर्मपालन।',
        shlokaData:[
          {num:'३.१९', text:'तस्मादसक्तः सततं कार्यं कर्म समाचर।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः॥', meaning:'इसलिए आसक्ति रहित होकर सदा कर्तव्य कर्म करो। आसक्ति रहित कर्म करने वाला परमात्मा को प्राप्त होता है।'}
        ]},
      { num:4,  hi:'ज्ञान कर्म संन्यास योग',       en:'Jnana Karma Sannyas Yoga',      shlokas:42,
        purpose:'"यदा यदा हि धर्मस्य" यहाँ है। ज्ञान यज्ञ और ईश्वर के अवतार का रहस्य।',
        shlokaData:[
          {num:'४.७', text:'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥', meaning:'जब-जब धर्म की हानि होती है, तब-तब मैं स्वयं को प्रकट करता हूँ।'},
          {num:'४.८', text:'परित्राणाय साधूनां विनाशाय च दुष्कृताम्।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥', meaning:'साधुओं की रक्षा, दुष्टों के विनाश और धर्म-स्थापना के लिए मैं युग-युग में जन्म लेता हूँ।'}
        ]},
      { num:5,  hi:'कर्म संन्यास योग',              en:'Karma Sannyas Yoga',            shlokas:29,
        purpose:'कर्म और संन्यास दोनों मोक्ष के मार्ग। कमल की तरह संसार में रहकर भी निर्लिप्त रहना।',
        shlokaData:[{num:'५.१०', text:'ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः।\nलिप्यते न स पापेन पद्मपत्रमिवाम्भसा॥', meaning:'जो ब्रह्म में अर्पित होकर आसक्ति छोड़ कर्म करता है, वह पाप से नहीं लिपता — जैसे कमल जल में रहकर गीला नहीं होता।'}]},
      { num:6,  hi:'ध्यान योग',                     en:'Dhyana Yoga',                   shlokas:47,
        purpose:'ध्यान और मन-नियंत्रण का विज्ञान। "आत्मा ही मित्र है, आत्मा ही शत्रु।"',
        shlokaData:[
          {num:'६.५',  text:'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥', meaning:'मनुष्य को स्वयं अपना उद्धार करना चाहिए। आत्मा ही अपनी मित्र है और आत्मा ही अपनी शत्रु है।'},
          {num:'६.३५', text:'असंशयं महाबाहो मनो दुर्निग्रहं चलम्।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥', meaning:'मन चञ्चल है, पर अभ्यास और वैराग्य से वश में हो जाता है।'}
        ]},
      { num:7,  hi:'ज्ञान विज्ञान योग',             en:'Jnana Vijnana Yoga',             shlokas:30,
        purpose:'ईश्वर का पूर्ण ज्ञान। "हज़ारों में कोई एक मुझे जानता है।"',
        shlokaData:[{num:'७.१९', text:'बहूनां जन्मनामन्ते ज्ञानवान्मां प्रपद्यते।\nवासुदेवः सर्वमिति स महात्मा सुदुर्लभः॥', meaning:'अनेक जन्मों के अन्त में ज्ञानी "सब कुछ वासुदेव है" ऐसा जानकर मुझे प्राप्त होता है — ऐसा महात्मा दुर्लभ है।'}]},
      { num:8,  hi:'अक्षर ब्रह्म योग',              en:'Akshara Brahma Yoga',           shlokas:28,
        purpose:'मृत्यु के समय परमात्मा स्मरण। "अन्त काले च मामेव।"',
        shlokaData:[{num:'८.५', text:'अन्तकाले च मामेव स्मरन्मुक्त्वा कलेवरम्।\nयः प्रयाति स मद्भावं याति नास्त्यत्र संशयः॥', meaning:'अन्त समय में मेरा स्मरण करते हुए शरीर छोड़ने वाला मेरे भाव को प्राप्त होता है — संशय नहीं।'}]},
      { num:9,  hi:'राज विद्या राज गुह्य योग',      en:'Raja Vidya Raja Guhya Yoga',    shlokas:34,
        purpose:'सबसे गोपनीय ज्ञान। "मेरे भक्त का योग और क्षेम मैं स्वयं वहन करता हूँ।"',
        shlokaData:[{num:'९.२२', text:'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥', meaning:'जो अनन्य भाव से मेरी उपासना करते हैं, उन नित्य-युक्त भक्तों का योग और क्षेम मैं स्वयं वहन करता हूँ।'}]},
      { num:10, hi:'विभूति योग',                    en:'Vibhuti Yoga',                  shlokas:42,
        purpose:'ईश्वर की विभूतियाँ — सृष्टि में ईश्वर को कहाँ देखें।',
        shlokaData:[{num:'१०.२०', text:'अहमात्मा गुडाकेश सर्वभूताशयस्थितः।\nअहमादिश्च मध्यं च भूतानामन्त एव च॥', meaning:'मैं सभी प्राणियों के हृदय में स्थित आत्मा हूँ। मैं ही सबका आदि, मध्य और अन्त हूँ।'}]},
      { num:11, hi:'विश्वरूप दर्शन योग',            en:'Vishwarupa Darshana Yoga',      shlokas:55,
        purpose:'भगवान का विराट विश्वरूप दर्शन। "कालोऽस्मि लोकक्षयकृत।"',
        shlokaData:[{num:'११.३२', text:'कालोऽस्मि लोकक्षयकृत्प्रवृद्धो,\nलोकान्समाहर्तुमिह प्रवृत्तः।', meaning:'मैं काल हूँ, लोकों का संहार करने वाला। तुम्हारे बिना भी ये योद्धा नहीं रहेंगे।'}]},
      { num:12, hi:'भक्ति योग',                     en:'Bhakti Yoga',                   shlokas:20,
        purpose:'भक्ति का सर्वश्रेष्ठ मार्ग। भक्त का स्वरूप और ईश्वर को प्रिय गुण।',
        shlokaData:[{num:'१२.१३', text:'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥', meaning:'जो सब से द्वेष नहीं करता, मित्र-करुणाशील है, ममता-अहंकार रहित है, सुख-दुःख में समान है — वह मुझे प्रिय है।'}]},
      { num:13, hi:'क्षेत्र क्षेत्रज्ञ विभाग योग', en:'Kshetra Kshetrajna Yoga',       shlokas:35,
        purpose:'शरीर (क्षेत्र) और आत्मा (क्षेत्रज्ञ) का ज्ञान। सांख्य दर्शन का सार।',
        shlokaData:[{num:'१३.२', text:'क्षेत्रज्ञं चापि मां विद्धि सर्वक्षेत्रेषु भारत।', meaning:'सभी शरीरों में क्षेत्रज्ञ (आत्मा) भी मुझे ही जानो।'}]},
      { num:14, hi:'गुणत्रय विभाग योग',             en:'Gunatraya Vibhaga Yoga',        shlokas:27,
        purpose:'तीन गुण — सत्व, रज, तम। इनसे मुक्ति ही मोक्ष।',
        shlokaData:[{num:'१४.५', text:'सत्त्वं रजस्तम इति गुणाः प्रकृतिसम्भवाः।\nनिबध्नन्ति महाबाहो देहे देहिनमव्ययम्॥', meaning:'सत्व, रज, तम — ये तीन गुण अविनाशी आत्मा को शरीर में बाँधते हैं।'}]},
      { num:15, hi:'पुरुषोत्तम प्राप्ति योग',       en:'Purushottama Prapti Yoga',      shlokas:20,
        purpose:'संसार-वृक्ष से विरक्ति और परमपुरुष की प्राप्ति।',
        shlokaData:[{num:'१५.१५', text:'सर्वस्य चाहं हृदि सन्निविष्टो\nमत्तः स्मृतिर्ज्ञानमपोहनं च।', meaning:'मैं सभी के हृदय में स्थित हूँ। मुझसे ही स्मृति, ज्ञान और विस्मरण होता है।'}]},
      { num:16, hi:'दैवासुर सम्पद् विभाग योग',     en:'Daivasura Sampad Yoga',         shlokas:24,
        purpose:'दैवी और आसुरी गुणों का विभाजन। अपने चरित्र का निर्माण।',
        shlokaData:[{num:'१६.१', text:'अभयं सत्त्वसंशुद्धिर्ज्ञानयोगव्यवस्थितिः।\nदानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम्॥', meaning:'निर्भयता, पवित्रता, ज्ञानयोग, दान, संयम, यज्ञ, स्वाध्याय, तप और सरलता — ये दैवी सम्पदा के लक्षण हैं।'}]},
      { num:17, hi:'श्रद्धात्रय विभाग योग',         en:'Shradhatraya Vibhaga Yoga',     shlokas:28,
        purpose:'श्रद्धा, आहार, यज्ञ, तप और दान के तीन-तीन प्रकार।',
        shlokaData:[{num:'१७.३', text:'सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत।\nश्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः॥', meaning:'प्रत्येक व्यक्ति की श्रद्धा उसके स्वभाव के अनुसार होती है। जैसी श्रद्धा — वैसा वह व्यक्ति।'}]},
      { num:18, hi:'मोक्ष संन्यास योग',              en:'Moksha Sannyas Yoga',           shlokas:78,
        purpose:'गीता का चरम सन्देश। "सब धर्म छोड़ मेरी शरण में आ।" — यही गीता-सार।',
        shlokaData:[
          {num:'१८.६५', text:'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु।\nमामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे॥', meaning:'मुझमें मन लगाओ, भक्त बनो, पूजा करो, प्रणाम करो — तुम मुझे पाओगे। यह मेरी सत्य प्रतिज्ञा है।'},
          {num:'१८.६६', text:'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥', meaning:'सभी धर्मों को छोड़कर केवल मेरी शरण में आ। मैं तुम्हें सभी पापों से मुक्त करूँगा — शोक मत करो।'}
        ]}
    ]
  },
  {
    id: 'rigveda', nameHi: 'ऋग्वेद', nameEn: 'Rigveda',
    icon: '📿', badge: 'badge-veda', badgeTxt: '10 मण्डल',
    desc: 'सबसे प्राचीन वेद — देवताओं की स्तुति के 1028 सूक्त, 10,552 मंत्र। गायत्री मंत्र यहाँ है।',
    audioPath: 'audio/rigveda/',
    chapters: [
      { num:1, hi:'प्रथम मण्डल — अग्नि देव', en:'Mandala 1 — Agni Deva', shlokas:191,
        purpose:'अग्नि देव की स्तुति। ऋग्वेद का प्रथम मंत्र। अग्नि = ज्ञान, पवित्रता, यज्ञ।',
        shlokaData:[
          {num:'१.१.१', text:'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्।\nहोतारं रत्नधातमम्॥', meaning:'मैं अग्नि की स्तुति करता हूँ जो यज्ञ के पुरोहित, देव, ऋत्विज और होता हैं — रत्नों के दाता। (ऋग्वेद का प्रथम मंत्र)'}
        ]},
      { num:3, hi:'तृतीय मण्डल — गायत्री मंत्र', en:'Mandala 3 — Gayatri Mantra', shlokas:62,
        purpose:'विश्वामित्र ऋषि के मंत्र। गायत्री मंत्र (३.६२.१०) — विश्व का सर्वाधिक जप किया जाने वाला मंत्र।',
        shlokaData:[
          {num:'३.६२.१०', text:'तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि।\nधियो यो नः प्रचोदयात्॥', meaning:'उस सविता देव के वरणीय तेज का हम ध्यान करते हैं। वे हमारी बुद्धि को सन्मार्ग पर प्रेरित करें। (गायत्री मंत्र — विश्व का सर्वाधिक जप मंत्र)'}
        ]},
      { num:10, hi:'दशम मण्डल — पुरुष सूक्त + नासदीय', en:'Mandala 10 — Purusha Sukta & Nasadiya', shlokas:191,
        purpose:'पुरुष सूक्त — सृष्टि की उत्पत्ति। नासदीय सूक्त — "सृष्टि से पहले क्या था?"',
        shlokaData:[
          {num:'१०.९०.१', text:'सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात्।', meaning:'विराट परमात्मा के हज़ार सिर, हज़ार आँखें और हज़ार पाँव हैं।'},
          {num:'१०.१२९.१', text:'नासदासीन्नो सदासीत्तदानीं नासीद्रजो नो व्योमा परो यत्।', meaning:'उस समय न असत् था, न सत् था, न आकाश था। (सृष्टि-पूर्व का दार्शनिक प्रश्न — नासदीय सूक्त)'}
        ]}
    ]
  },
  {
    id: 'samaveda', nameHi: 'सामवेद', nameEn: 'Samaveda',
    icon: '📿', badge: 'badge-veda', badgeTxt: '2 भाग',
    desc: 'संगीत वेद — 1875 मंत्र। यज्ञ में गाये जाते थे। भगवान कृष्ण ने कहा: "वेदानां सामवेदोऽस्मि"',
    audioPath: 'audio/samaveda/',
    chapters: [
      { num:1, hi:'पूर्वार्चिक — देवस्तुति', en:'Purvarchika — Deva Stuti', shlokas:585,
        purpose:'अग्नि, इन्द्र, सोम की गेय स्तुतियाँ। कृष्ण ने गीता में कहा — "वेदों में मैं सामवेद हूँ।"',
        shlokaData:[{num:'१.१', text:'अग्न आ याहि वीतये गृणानो हव्यदातये।\nनि होता सत्सि बर्हिषि॥', meaning:'हे अग्नि! प्रसन्न होकर यज्ञ के लिए आइये, हवि ग्रहण करने हेतु। (सामवेद का प्रथम मंत्र — संगीत में गाया जाता था)'}]},
      { num:2, hi:'उत्तरार्चिक — सोम स्तुति', en:'Uttararchika — Soma Stuti', shlokas:1225,
        purpose:'सोम — चन्द्रमा और यज्ञीय रस के देव। स्वास्थ्य और दीर्घायु के मंत्र।',
        shlokaData:[{num:'२.१', text:'इन्द्र इद्धर्योः सचा संमिश्ल आ वचोयुजा।\nइन्द्रो वज्री हिरण्ययः॥', meaning:'इन्द्र अपने दोनों घोड़ों के साथ, वाणी से संयुक्त। इन्द्र वज्रधारी और स्वर्णमय हैं।'}]}
    ]
  },
  {
    id: 'yajurveda', nameHi: 'यजुर्वेद', nameEn: 'Yajurveda',
    icon: '📿', badge: 'badge-veda', badgeTxt: '40 अध्याय',
    desc: 'यज्ञ विधान वेद। शिव संकल्प सूक्त और ईशावास्योपनिषद् यहाँ हैं।',
    audioPath: 'audio/yajurveda/',
    chapters: [
      { num:1,  hi:'प्रथम अध्याय — यज्ञ आरम्भ', en:'Chapter 1 — Yajna Beginning', shlokas:30,
        purpose:'यज्ञ के संकल्प और आरम्भ के मंत्र। देव-आह्वान और पवित्रीकरण।',
        shlokaData:[{num:'१.१', text:'इषे त्वोर्जे त्वा वायवस्थ देवो वः सविता प्रार्पयतु।\nश्रेष्ठतमाय कर्मणे॥', meaning:'अन्न और बल के लिए नियुक्त करता हूँ। देव सविता श्रेष्ठ कर्म के लिए प्रेरित करें।'}]},
      { num:34, hi:'चौंतीसवाँ अध्याय — शिव संकल्प सूक्त', en:'Chapter 34 — Shiva Sankalpa Sukta', shlokas:6,
        purpose:'"मेरा मन शुभ संकल्प वाला हो" — 6 मंत्रों का यह सूक्त मन को पवित्र करता है।',
        shlokaData:[
          {num:'३४.१', text:'येनेदं भूतं भुवनं भविष्यत्परिगृहीतममृतेन सर्वम्।\nयेन यज्ञस्तायते सप्तहोता तन्मे मनः शिवसंकल्पमस्तु॥', meaning:'जिस मन से यह सम्पूर्ण सृष्टि धारण होती है, जिससे सात होताओं वाला यज्ञ विस्तृत होता है — वह मेरा मन शुभ संकल्प वाला हो।'},
          {num:'३४.६', text:'सुषारथिरश्वानिव यन्मनुष्यान्नेनीयतेऽभीशुभिर्वाजिन इव।\nहृत्प्रतिष्ठं यदजिरं जविष्ठं तन्मे मनः शिवसंकल्पमस्तु॥', meaning:'जो मन कुशल सारथि की तरह मनुष्यों को प्रेरित करता है, हृदय में प्रतिष्ठित, अजर, वेगवान — वह मेरा मन शुभ संकल्प वाला हो।'}
        ]},
      { num:40, hi:'चालीसवाँ अध्याय — ईशावास्योपनिषद', en:'Chapter 40 — Ishopanishad', shlokas:18,
        purpose:'"ईशावास्यमिदं सर्वम्" — सब कुछ में ईश्वर। सबसे छोटी और गहरी उपनिषद।',
        shlokaData:[
          {num:'४०.१', text:'ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥', meaning:'इस जगत में जो कुछ भी है, वह सब ईश्वर से व्याप्त है। त्याग भाव से भोगो। किसी के धन का लालच मत करो।'},
          {num:'४०.२', text:'कुर्वन्नेवेह कर्माणि जिजीविषेच्छतं समाः।\nएवं त्वयि नान्यथेतोऽस्ति न कर्म लिप्यते नरे॥', meaning:'कर्म करते हुए ही सौ वर्ष जीने की इच्छा करो। इस प्रकार कर्म लगेगा नहीं।'}
        ]}
    ]
  },
  {
    id: 'atharvaveda', nameHi: 'अथर्ववेद', nameEn: 'Atharvaveda',
    icon: '📿', badge: 'badge-veda', badgeTxt: '20 काण्ड',
    desc: 'जीवन विज्ञान वेद — 5977 मंत्र। भूमि सूक्त, आयुर्वेद और राष्ट्र-निर्माण के मंत्र।',
    audioPath: 'audio/atharvaveda/',
    chapters: [
      { num:1, hi:'प्रथम काण्ड — आयुर्वेद मंत्र', en:'Kanda 1 — Ayurveda Mantras', shlokas:35,
        purpose:'रोग निवारण, आरोग्य और दीर्घायु। आयुर्वेद का मूल स्रोत।',
        shlokaData:[{num:'१.१.१', text:'ये त्रिषप्ताः परियन्ति विश्वा रूपाणि बिभ्रतः।\nवाचस्पतिर्बला तेषां तन्वो अद्य दधातु मे॥', meaning:'जो 21 दिव्यशक्तियाँ विश्व के सभी रूप धारण करती हैं, वाक्-स्वामी उनका बल आज मेरे शरीर में स्थापित करें।'}]},
      { num:12, hi:'द्वादश काण्ड — भूमि सूक्त', en:'Kanda 12 — Bhoomi Sukta', shlokas:57,
        purpose:'"माता भूमिः पुत्रोऽहं पृथिव्याः" — पृथ्वी माता है। पर्यावरण-चेतना का सबसे प्राचीन उद्घोष।',
        shlokaData:[
          {num:'१२.१.१', text:'सत्यं बृहदृतमुग्रं दीक्षा तपो ब्रह्म यज्ञः पृथिवीं धारयन्ति।', meaning:'सत्य, ऋत, दीक्षा, तप, ब्रह्म और यज्ञ — ये पृथ्वी को धारण करते हैं।'},
          {num:'१२.१.१२', text:'माता भूमिः पुत्रोऽहं पृथिव्याः।\nपर्जन्यः पिता स उ नः पिपर्तु॥', meaning:'पृथ्वी माता है, मैं पृथ्वी का पुत्र हूँ। वर्षा-देव पिता हैं, वे हमारा पोषण करें। (सबसे प्राचीन पर्यावरण उद्घोष)'}
        ]},
      { num:19, hi:'उन्नीसवाँ काण्ड — राष्ट्र धर्म', en:'Kanda 19 — Rashtra Dharma', shlokas:72,
        purpose:'"संगच्छध्वं संवदध्वं" — मिलकर चलो। राष्ट्रीय एकता का सबसे पुराना मंत्र।',
        shlokaData:[{num:'७.५२.१', text:'संगच्छध्वं संवदध्वं सं वो मनांसि जानताम्।\nदेवा भागं यथा पूर्वे सञ्जानाना उपासते॥', meaning:'मिलकर चलो, मिलकर बात करो, तुम्हारे मन एक-दूसरे को जानें। (राष्ट्रीय एकता का वैदिक मंत्र)'}]}
    ]
  }
];

/* ══════════════════════════════════════════
   READER STATE
   ══════════════════════════════════════════ */
var GV = {
  current:   null,   // current SCRIPTURES entry
  chapter:   null,   // current chapter object
  audioEl:   null    // current Audio element
};

/* ══════════════════════════════════════════
   RENDER SCRIPTURE GRID
   ══════════════════════════════════════════ */
function renderGVGrid() {
  var html = '';
  for (var i = 0; i < SCRIPTURES.length; i++) {
    var s = SCRIPTURES[i];
    html += '<div class="gv-card" onclick="openScripture(' + i + ')">'
      + '<div class="gv-icon">'    + s.icon    + '</div>'
      + '<div class="gv-name-hi">' + s.nameHi  + '</div>'
      + '<div class="gv-name-en">' + s.nameEn  + '</div>'
      + '<div class="gv-desc">'    + s.desc     + '</div>'
      + '<span class="gv-badge '   + s.badge + '">' + s.badgeTxt + '</span>'
      + '</div>';
  }
  document.getElementById('gvGrid').innerHTML = html;
}

/* ══════════════════════════════════════════
   OPEN SCRIPTURE → show chapter list
   ══════════════════════════════════════════ */
function openScripture(idx) {
  GV.current = SCRIPTURES[idx];
  GV.chapter  = null;

  document.getElementById('gvMain').style.display   = 'none';
  document.getElementById('gvReader').style.display = 'block';
  document.getElementById('readerTitle').textContent = GV.current.nameHi + ' — ' + GV.current.nameEn;

  // Build chapter buttons
  var chs  = GV.current.chapters;
  var html = '';
  for (var i = 0; i < chs.length; i++) {
    var c = chs[i];
    var label = c.hi.length > 14 ? c.hi.substring(0, 14) + '…' : c.hi;
    html += '<div class="ch-btn" id="chBtn' + i + '" onclick="openChapter(' + i + ')">'
      + '<div class="ch-btn-num">अध्याय ' + c.num + '</div>'
      + '<div class="ch-btn-hi">'  + label + '</div>'
      + '</div>';
  }
  document.getElementById('chapterGrid').innerHTML = html;
  document.getElementById('chContent').style.display = 'none';
}

/* ══════════════════════════════════════════
   OPEN CHAPTER → show shlokas
   ══════════════════════════════════════════ */
function openChapter(idx) {
  // Highlight button
  var btns = document.querySelectorAll('.ch-btn');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('on');
  document.getElementById('chBtn' + idx).classList.add('on');

  GV.chapter = GV.current.chapters[idx];
  var c = GV.chapter;

  // Build shloka blocks
  var shlokaHtml = '';
  if (c.shlokaData && c.shlokaData.length) {
    for (var i = 0; i < c.shlokaData.length; i++) {
      var sh = c.shlokaData[i];
      shlokaHtml += '<div class="shloka-block">'
        + '<div class="shloka-num">श्लोक ' + sh.num + '</div>'
        + '<div class="shloka-text">' + sh.text.replace(/\n/g, '<br>') + '</div>'
        + '<div class="shloka-meaning">' + sh.meaning + '</div>'
        + '</div>';
    }
    var remaining = c.shlokas - c.shlokaData.length;
    if (remaining > 0) {
      shlokaHtml += '<div style="text-align:center;padding:14px;font-size:.8rem;color:rgba(253,246,227,.4);font-family:\'Tiro Devanagari Sanskrit\',serif;">'
        + '… इस अध्याय के शेष ' + remaining + ' श्लोक पूर्ण संस्करण में।<br>'
        + '<span style="font-size:.7rem">Full text at vedabase.io / gitapress.org</span>'
        + '</div>';
    }
  }

  var html = '<div class="ch-content-title">' + c.hi + '</div>'
    + '<div class="ch-content-sub">' + c.en.toUpperCase() + ' · ' + c.shlokas + ' SHLOKAS</div>'
    + '<div class="ch-purpose"><span class="ch-purpose-lbl">🙏 प्रयोजन | Purpose &amp; Significance</span>' + c.purpose + '</div>'
    + shlokaHtml;

  var el = document.getElementById('chContent');
  el.innerHTML = html;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ══════════════════════════════════════════
   CLOSE READER
   ══════════════════════════════════════════ */
function closeReader() {
  if (GV.audioEl) { GV.audioEl.pause(); GV.audioEl = null; }
  document.getElementById('gvMain').style.display   = 'block';
  document.getElementById('gvReader').style.display = 'none';
  GV.current = null;
  GV.chapter  = null;
}

/* ══════════════════════════════════════════
   AUDIO PLAYBACK
   ══════════════════════════════════════════ */
function playScriptureAudio() {
  if (!GV.current) return;
  var chNum = GV.chapter ? GV.chapter.num : 1;
  var path  = GV.current.audioPath + 'chapter' + chNum + '.mp3';
  if (GV.audioEl) GV.audioEl.pause();
  GV.audioEl = new Audio(path);
  GV.audioEl.volume = 0.8;
  GV.audioEl.play().catch(function() {
    alert('ऑडियो फाइल नहीं मिली। कृपया अपलोड करें:\n' + path);
  });
}
