import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, BookOpen, Star } from "lucide-react";

interface Alwar {
  number: number;
  nameTamil: string;
  nameEnglish: string;
  birthPlace: string;
  birthPlaceTamil: string;
  period: string;
  story: string;
  storyTamil: string;
  associatedTemple: string;
  associatedTempleTamil: string;
  literaryWork: string;
  literaryWorkTamil: string;
  paasuramCount: number;
  highlight: string;
}

const ALWARS: Alwar[] = [
  {
    number: 1, nameTamil: "பொய்கையாழ்வார்", nameEnglish: "Poigai Alwar",
    birthPlace: "Kanchipuram", birthPlaceTamil: "காஞ்சிபுரம்",
    period: "7th Century",
    story: "Born from a golden lotus in a pond at Kanchipuram. One rainy night, three Alwars took shelter in a small room. When it became crowded, they realized Vishnu was present among them. Poigai composed the first Mudhal Thiruvandhadhi using the earth as lamp, ocean as oil, and sun as flame.",
    storyTamil: "காஞ்சிபுரத்தில் பொற்றாமரையில் அவதரித்தவர். ஒரு மழை இரவில் மூன்று ஆழ்வார்கள் ஒரு சிறிய அறையில் தங்கினர். நெருக்கமானபோது விஷ்ணு அங்கு இருப்பதை உணர்ந்தனர். பூமியை விளக்காகவும், கடலை எண்ணெயாகவும், சூரியனை சுடராகவும் கொண்டு முதல் திருவந்தாதி பாடினார்.",
    associatedTemple: "Yathothkari Perumal Temple, Kanchipuram", associatedTempleTamil: "யதோத்காரி பெருமாள் கோவில், காஞ்சிபுரம்",
    literaryWork: "Mudhal Thiruvandhadhi", literaryWorkTamil: "முதல் திருவந்தாதி", paasuramCount: 100,
    highlight: "முதல் ஆழ்வார்"
  },
  {
    number: 2, nameTamil: "பூதத்தாழ்வார்", nameEnglish: "Bhoothathalwar",
    birthPlace: "Mamallapuram", birthPlaceTamil: "மாமல்லபுரம்",
    period: "7th Century",
    story: "Born from a blue lotus in a pond at Mamallapuram. He was the second of the Mudhal Alwars. He composed Irandam Thiruvandhadhi using love as lamp, enthusiasm as oil, and the melting mind as flame to see Vishnu.",
    storyTamil: "மாமல்லபுரத்தில் நீலத் தாமரையில் அவதரித்தவர். முதல் ஆழ்வார்களில் இரண்டாவது. அன்பை விளக்காகவும், ஆர்வத்தை எண்ணெயாகவும், உருகும் மனதை சுடராகவும் கொண்டு இரண்டாம் திருவந்தாதி பாடினார்.",
    associatedTemple: "Sthalasayana Perumal Temple, Mamallapuram", associatedTempleTamil: "ஸ்தலசயன பெருமாள் கோவில், மாமல்லபுரம்",
    literaryWork: "Irandam Thiruvandhadhi", literaryWorkTamil: "இரண்டாம் திருவந்தாதி", paasuramCount: 100,
    highlight: "இரண்டாம் ஆழ்வார்"
  },
  {
    number: 3, nameTamil: "பேயாழ்வார்", nameEnglish: "Peyalwar",
    birthPlace: "Mylapore, Chennai", birthPlaceTamil: "மயிலாப்பூர், சென்னை",
    period: "7th Century",
    story: "Born from a red lotus in a well at Mylapore. The third Mudhal Alwar. He saw Vishnu with Lakshmi on that famous rainy night and composed Moonram Thiruvandhadhi describing the divine vision.",
    storyTamil: "மயிலாப்பூரில் செந்தாமரையில் அவதரித்தவர். மூன்றாவது முதல் ஆழ்வார். அந்த புகழ்பெற்ற மழை இரவில் லட்சுமியுடன் விஷ்ணுவைக் கண்டு மூன்றாம் திருவந்தாதி பாடினார்.",
    associatedTemple: "Adikesava Perumal Temple, Mylapore", associatedTempleTamil: "ஆதிகேசவ பெருமாள் கோவில், மயிலாப்பூர்",
    literaryWork: "Moonram Thiruvandhadhi", literaryWorkTamil: "மூன்றாம் திருவந்தாதி", paasuramCount: 100,
    highlight: "மூன்றாம் ஆழ்வார்"
  },
  {
    number: 4, nameTamil: "திருமழிசையாழ்வார்", nameEnglish: "Thirumazhisai Alwar",
    birthPlace: "Thirumazhisai", birthPlaceTamil: "திருமழிசை",
    period: "7th Century",
    story: "Son of sage Bhargava born in Thirumazhisai near Chennai. Initially studied Shaivism, Buddhism, and Jainism before finding ultimate truth in Vaishnavism. When the Pallava king banished his disciple Kanikannan, he asked Vishnu to also leave, and the Lord rolled up his serpent bed and followed!",
    storyTamil: "சென்னை அருகில் திருமழிசையில் பிறந்த பார்கவ முனிவரின் மகன். முதலில் சைவம், புத்தம், சமணம் பயின்று இறுதியில் வைணவத்தில் உண்மையைக் கண்டார். பல்லவ மன்னர் சீடன் கணிகண்ணனை நாடு கடத்தியபோது, விஷ்ணுவையும் வரச் சொன்னார், பெருமாளும் படுக்கையை சுருட்டிக்கொண்டு சென்றார்!",
    associatedTemple: "Jagannatha Perumal Temple, Thirumazhisai", associatedTempleTamil: "ஜகந்நாத பெருமாள் கோவில், திருமழிசை",
    literaryWork: "Naanmugan Thiruvandhadhi & Thiruchanda Virutham", literaryWorkTamil: "நான்முகன் திருவந்தாதி & திருச்சந்த விருத்தம்", paasuramCount: 216,
    highlight: "பக்தி சக்தி"
  },
  {
    number: 5, nameTamil: "நம்மாழ்வார்", nameEnglish: "Nammalwar",
    birthPlace: "Alwarthirunagari", birthPlaceTamil: "ஆழ்வார்திருநகரி",
    period: "9th Century",
    story: "Born in Alwarthirunagari, he meditated under a tamarind tree from birth without eating or speaking for 16 years. His disciple Madhurakavi Alwar found him and became his student. He composed Thiruvaimozhi, the Tamil Veda of 1102 verses, considered equivalent to the Sanskrit Vedas.",
    storyTamil: "ஆழ்வார்திருநகரியில் பிறந்து, பிறப்பிலிருந்து 16 ஆண்டுகள் புளிய மரத்தின் கீழ் சாப்பிடாமல் பேசாமல் தவம் செய்தார். மதுரகவி ஆழ்வார் அவரைக் கண்டு சீடரானார். தமிழ் வேதமான திருவாய்மொழி 1102 பாசுரங்கள் இயற்றினார்.",
    associatedTemple: "Adhinathar Temple, Alwarthirunagari", associatedTempleTamil: "ஆதிநாதர் கோவில், ஆழ்வார்திருநகரி",
    literaryWork: "Thiruvaimozhi, Thiruviruttam, Thiruvasiriyam, Periya Thiruvandhadhi", literaryWorkTamil: "திருவாய்மொழி, திருவிருத்தம், திருவாசிரியம், பெரிய திருவந்தாதி", paasuramCount: 1352,
    highlight: "பிரபந்த சக்கரவர்த்தி"
  },
  {
    number: 6, nameTamil: "மதுரகவியாழ்வார்", nameEnglish: "Madhurakavi Alwar",
    birthPlace: "Thirukolur", birthPlaceTamil: "திருக்கோளூர்",
    period: "9th Century",
    story: "While on pilgrimage in North India, he saw a bright light in the south. Following it, he reached Nammalwar meditating under the tamarind tree. He became Nammalwar's devoted disciple. Unique among Alwars for composing hymns praising his guru rather than Vishnu directly.",
    storyTamil: "வட இந்தியாவில் யாத்திரை செய்யும்போது தெற்கில் ஒரு ஒளியைக் கண்டார். அதைத் தொடர்ந்து நம்மாழ்வாரிடம் வந்தார். குருவைப் புகழ்ந்து பாடிய தனித்தன்மை கொண்ட ஆழ்வார்.",
    associatedTemple: "Thirukolur Vamana Temple", associatedTempleTamil: "திருக்கோளூர் வாமன கோவில்",
    literaryWork: "Kanninun Siruthambu", literaryWorkTamil: "கண்ணிநுண் சிறுத்தாம்பு", paasuramCount: 11,
    highlight: "குரு பக்தி"
  },
  {
    number: 7, nameTamil: "குலசேகராழ்வார்", nameEnglish: "Kulasekhara Alwar",
    birthPlace: "Thiruvanchikkulam, Kerala", birthPlaceTamil: "திருவஞ்சிக்குளம், கேரளா",
    period: "9th Century",
    story: "A Chera king of Kerala who was an ardent devotee of Rama. When a drama about Ramayana was performed, he drew his sword to fight Ravana! He eventually renounced his throne and went to Srirangam where he lived as a devotee.",
    storyTamil: "கேரளாவின் சேர மன்னர். ராமனின் தீவிர பக்தர். ராமாயண நாடகம் நடக்கும்போது ராவணனை எதிர்க்க வாளை உருவினார்! இறுதியில் அரியணையை துறந்து ஸ்ரீரங்கத்தில் பக்தராக வாழ்ந்தார்.",
    associatedTemple: "Srirangam Ranganathaswamy Temple", associatedTempleTamil: "ஸ்ரீரங்கம் ரங்கநாதர் கோவில்",
    literaryWork: "Perumal Thirumozhi & Mukundamala", literaryWorkTamil: "பெருமாள் திருமொழி & முகுந்தமாலா", paasuramCount: 105,
    highlight: "அரசை துறந்த மன்னர்"
  },
  {
    number: 8, nameTamil: "பெரியாழ்வார்", nameEnglish: "Periyalwar",
    birthPlace: "Srivilliputhur", birthPlaceTamil: "ஸ்ரீவில்லிப்புத்தூர்",
    period: "9th Century",
    story: "A Brahmin who tended the temple garden at Srivilliputhur. He won a debate at the Pandya court proving Vishnu's supremacy. He is famous for singing Pallandu (blessings) to Vishnu, worrying about the Lord's safety like a parent! Father of Andal.",
    storyTamil: "ஸ்ரீவில்லிப்புத்தூர் கோவில் நந்தவனம் பராமரித்தவர். பாண்டிய அவையில் விஷ்ணுவின் மேன்மையை நிரூபித்து வாதம் வென்றார். பெற்றோர் போல் பெருமாளின் பாதுகாப்பு குறித்து கவலைப்பட்டு பல்லாண்டு பாடியவர். ஆண்டாளின் தந்தை.",
    associatedTemple: "Srivilliputhur Andal Temple", associatedTempleTamil: "ஸ்ரீவில்லிப்புத்தூர் ஆண்டாள் கோவில்",
    literaryWork: "Periyalwar Thirumozhi & Thiruppallandu", literaryWorkTamil: "பெரியாழ்வார் திருமொழி & திருப்பல்லாண்டு", paasuramCount: 473,
    highlight: "ஆண்டாள் தந்தை, பல்லாண்டு"
  },
  {
    number: 9, nameTamil: "ஆண்டாள்", nameEnglish: "Andal",
    birthPlace: "Srivilliputhur", birthPlaceTamil: "ஸ்ரீவில்லிப்புத்தூர்",
    period: "9th Century",
    story: "The only female Alwar, found as a baby under a tulsi plant by Periyalwar. She fell in love with Vishnu and would secretly wear the temple garland before offering it to the deity. She composed Thiruppavai (30 verses for Margazhi) and Nachiyar Thirumozhi expressing her longing. She merged with Ranganatha at Srirangam.",
    storyTamil: "ஒரே பெண் ஆழ்வார். பெரியாழ்வாரால் துளசிச் செடியின் கீழ் குழந்தையாகக் கண்டெடுக்கப்பட்டவர். விஷ்ணுவின் மீது காதல் கொண்டு கோவில் மாலையை இரகசியமாக அணிந்து பின் கடவுளுக்கு அளித்தார். திருப்பாவை (மார்கழி 30 பாடல்கள்) பாடினார். ஸ்ரீரங்கத்தில் ரங்கநாதரில் கலந்தார்.",
    associatedTemple: "Srivilliputhur Andal Temple & Srirangam", associatedTempleTamil: "ஸ்ரீவில்லிப்புத்தூர் ஆண்டாள் கோவில் & ஸ்ரீரங்கம்",
    literaryWork: "Thiruppavai & Nachiyar Thirumozhi", literaryWorkTamil: "திருப்பாவை & நாச்சியார் திருமொழி", paasuramCount: 173,
    highlight: "ஒரே பெண் ஆழ்வார், திருப்பாவை"
  },
  {
    number: 10, nameTamil: "தொண்டரடிப்பொடியாழ்வார்", nameEnglish: "Thondaradippodi Alwar",
    birthPlace: "Thirumandangudi", birthPlaceTamil: "திருமண்டங்குடி",
    period: "9th Century",
    story: "Devoted to growing flowers for Ranganatha at Srirangam. A courtesan named Devadevi tried to distract him, and he temporarily fell from grace, but Ranganatha himself intervened to bring him back to devotion.",
    storyTamil: "ஸ்ரீரங்கத்தில் ரங்கநாதருக்கு மலர் வளர்ப்பதில் ஈடுபட்டவர். தேவதேவி என்ற நர்த்தகி அவரை திசை திருப்ப முயன்றார், தற்காலிகமாக வழி தவறினார், ஆனால் ரங்கநாதரே தலையிட்டு அவரை மீட்டார்.",
    associatedTemple: "Srirangam Ranganathaswamy Temple", associatedTempleTamil: "ஸ்ரீரங்கம் ரங்கநாதர் கோவில்",
    literaryWork: "Thirumalai & Thiruppalliezhuchi", literaryWorkTamil: "திருமாலை & திருப்பள்ளியெழுச்சி", paasuramCount: 55,
    highlight: "திருப்பள்ளியெழுச்சி"
  },
  {
    number: 11, nameTamil: "திருப்பாணாழ்வார்", nameEnglish: "Thiruppanalwar",
    birthPlace: "Woraiyur, Trichy", birthPlaceTamil: "உறையூர், திருச்சி",
    period: "9th Century",
    story: "Born in a lower caste (Panar - musicians), he sang divine music for Vishnu from the banks of Kaveri but wouldn't cross to Srirangam thinking himself unworthy. Ranganatha ordered the temple priest Lokasaranga to carry him on his shoulders into the temple. He composed Amalanadipiran describing Vishnu from feet to head and merged with the deity.",
    storyTamil: "பாணர் குலத்தில் பிறந்தவர். காவிரிக் கரையிலிருந்து விஷ்ணுவுக்கு இசை பாடினார், ஆனால் தகுதியற்றவர் என்று ஸ்ரீரங்கத்திற்கு கடக்கவில்லை. ரங்கநாதர் கோவில் பூசாரி லோகசாரங்கரிடம் அவரை தோளில் சுமந்து கொண்டு வரச் சொன்னார். அமலனாதிபிரான் பாடி பெருமாளில் கலந்தார்.",
    associatedTemple: "Srirangam Ranganathaswamy Temple", associatedTempleTamil: "ஸ்ரீரங்கம் ரங்கநாதர் கோவில்",
    literaryWork: "Amalanadipiran", literaryWorkTamil: "அமலனாதிபிரான்", paasuramCount: 10,
    highlight: "10 பாசுரம், சாதி தடையை உடைத்தவர்"
  },
  {
    number: 12, nameTamil: "திருமங்கையாழ்வார்", nameEnglish: "Thirumangai Alwar",
    birthPlace: "Thirukuraiyalur", birthPlaceTamil: "திருக்குறையலூர்",
    period: "9th Century",
    story: "Originally a Chola army chief named Neelan. He fell in love with Kumudavalli who agreed to marry him only if he fed 1008 Vaishnavas daily. He turned to highway robbery to fund this! He later repented and became the greatest composer among the Alwars with 1361 pasurams. He built the walls of Srirangam temple.",
    storyTamil: "முதலில் நீலன் என்ற சோழ படைத் தலைவர். குமுதவல்லி தினமும் 1008 வைணவர்களுக்கு உணவளித்தால் மட்டுமே திருமணம் செய்வதாகச் சொன்னார். இதற்காக வழிப்பறி செய்தார்! பின்னர் வருந்தி, ஆழ்வார்களிலேயே அதிக 1361 பாசுரங்கள் பாடினார். ஸ்ரீரங்கம் கோவில் மதில் சுவர் கட்டினார்.",
    associatedTemple: "Srirangam & 86 Divya Desams visited", associatedTempleTamil: "ஸ்ரீரங்கம் & 86 திவ்ய தேசங்கள் பயணம்",
    literaryWork: "Periya Thirumozhi, Thirukkurundhandagam, Thirunedundhandagam & more", literaryWorkTamil: "பெரிய திருமொழி, திருக்குறுந்தாண்டகம், திருநெடுந்தாண்டகம் & மேலும்", paasuramCount: 1361,
    highlight: "அதிக பாசுரங்கள், ஸ்ரீரங்கம் மதில்"
  },
];

export default function AlwarsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <BackButton />

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-tamil text-gradient-sacred">
            பன்னிரு ஆழ்வார்கள்
          </h1>
          <p className="text-muted-foreground">12 Alwars — The Great Vaishnava Saints</p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            நாலாயிர திவ்ய பிரபந்தம் பாடிய 12 ஆழ்வார்கள். இவர்களின் பாசுரங்கள் தமிழ் வேதமாகப் போற்றப்படுகின்றன.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="text-center px-4 py-2 bg-sacred/10 rounded-lg">
            <p className="text-2xl font-bold text-sacred">12</p>
            <p className="text-xs text-muted-foreground">ஆழ்வார்கள்</p>
          </div>
          <div className="text-center px-4 py-2 bg-sacred/10 rounded-lg">
            <p className="text-2xl font-bold text-sacred">4000</p>
            <p className="text-xs text-muted-foreground">பாசுரங்கள்</p>
          </div>
          <div className="text-center px-4 py-2 bg-sacred/10 rounded-lg">
            <p className="text-2xl font-bold text-sacred">108</p>
            <p className="text-xs text-muted-foreground">திவ்ய தேசங்கள்</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {ALWARS.map((a) => {
            const isExpanded = expandedId === a.number;
            return (
              <Card
                key={a.number}
                className="cursor-pointer hover:shadow-lg transition-shadow border-sacred/20"
                onClick={() => setExpandedId(isExpanded ? null : a.number)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-xs bg-sacred/10 text-sacred border-sacred/30">
                      #{a.number}
                    </Badge>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">{a.period}</Badge>
                      <Badge className="text-xs bg-primary/20 text-primary">{a.paasuramCount} பாசுரம்</Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-tamil leading-relaxed">{a.nameTamil}</CardTitle>
                  <p className="text-sm text-muted-foreground">{a.nameEnglish}</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{a.birthPlaceTamil} ({a.birthPlace})</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{a.highlight}</Badge>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-3 animate-in fade-in">
                      <div>
                        <p className="font-semibold text-xs text-muted-foreground mb-1">கதை (Tamil)</p>
                        <p className="font-tamil text-sm leading-relaxed">{a.storyTamil}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-muted-foreground mb-1">Story (English)</p>
                        <p className="text-sm leading-relaxed">{a.story}</p>
                      </div>
                      <div className="flex items-start gap-1">
                        <Star className="h-3 w-3 mt-0.5 text-sacred" />
                        <div>
                          <p className="font-semibold text-xs text-muted-foreground">தொடர்புடைய கோவில்</p>
                          <p className="font-tamil text-sm">{a.associatedTempleTamil}</p>
                          <p className="text-xs text-muted-foreground">{a.associatedTemple}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-1">
                        <BookOpen className="h-3 w-3 mt-0.5 text-sacred" />
                        <div>
                          <p className="font-semibold text-xs text-muted-foreground">இலக்கியப் படைப்புகள்</p>
                          <p className="font-tamil text-sm">{a.literaryWorkTamil}</p>
                          <p className="text-xs text-muted-foreground">{a.literaryWork}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
