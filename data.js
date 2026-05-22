// Wedflix trailer data — edit via editor.html, then export ZIP.
// Edit titles/descriptions/tags to match the actual filmed trailers.

window.WEDFLIX_DATA = {
  profiles: [
    { id: 'p1', name: "The Bride", color: '#C8102E' },
    { id: 'p2', name: "The Groom", color: '#3B82F6' },
    { id: 'p3', name: "Bridesmaids", color: '#F59E0B' },
    { id: 'p4', name: "Kids", color: '#10B981', kid: true },
    { id: 'p5', name: "+ Add Profile", color: '#404040', add: true }
  ],

  trailers: [
    { id: 't01', title: "How They Met", year: 2016, mins: 4, rating: 'TV-MA', tags: ["Unhinged","Mildly Romantic","Tinder-Adjacent"], match: 98, award: "Critically Roasted", awardSub: "Winner: Best Use of Pickup Line", desc: "A chance encounter at a dive bar leads to the romance of the century — or so the unreliable narrators claim. Witnesses dispute every detail.", cast: ["Sarah M.","Daniel K.","A suspicious mojito"], genres: ["Romance","Documentary","Comedy"],
    image: 'images/t01.jpg', },
    { id: 't02', title: "The Proposal: Directors Cut", year: 2023, mins: 6, rating: 'TV-PG', tags: ["Sentimental","Tear-Jerker","Pre-Planned Down To The Minute"], match: 99, award: "Mom Approved", awardSub: "Nominated: Best Crying On Camera", desc: "After 47 failed rehearsals, the groom finally pops the question. Camera angles courtesy of a cousin who watched too many YouTube tutorials.", cast: ["Sarah M.","Daniel K.","A hidden cousin"], genres: ["Romance","Drama"],
    image: 'images/t02.jpg', },
    { id: 't03', title: "Bachelorette: Vegas Heist", year: 2024, mins: 5, rating: 'TV-MA', tags: ["Chaotic","Hangover-Inducing","Lost Phone Energy"], match: 94, award: "Cease & Desist Pending", awardSub: "Banned in 3 hotel chains", desc: "Seven bridesmaids, one suite, zero impulse control. What happened on the strip is rumored to be the subject of a pending Netflix lawsuit.", cast: ["The Bride","The Maids","Elvis impersonator #4"], genres: ["Action","Comedy"],
    image: 'images/t03.jpg', },
    { id: 't04', title: "Bachelor Party: Tokyo Drift", year: 2024, mins: 4, rating: 'TV-MA', tags: ["Misguided","Karaoke-Heavy","Filmed Vertically"], match: 87, award: "Survived", awardSub: "0 injuries, 1 missing passport", desc: "The groomsmen attempt sophistication abroad. They fail. A spreadsheet was made. The spreadsheet was abandoned by hour 3.", cast: ["The Groom","The Best Men"], genres: ["Comedy","Travel"],
    image: 'images/t04.jpg', },
    { id: 't05', title: "Meet The Parents 4: Final Approval", year: 2018, mins: 5, rating: 'TV-14', tags: ["Awkward","Steakhouse","Sweaty Palms"], match: 91, award: "Father-of-Bride Cleared", awardSub: "No firearms displayed", desc: "A nervous first dinner with the in-laws. Politics avoided. Religion avoided. Vacation timeshares aggressively discussed.", cast: ["The Groom","The Dad","A nervous tie"], genres: ["Comedy","Drama"],
    image: 'images/t05.jpg', },
    { id: 't06', title: "The IKEA Incident", year: 2019, mins: 3, rating: 'TV-MA', tags: ["Cathartic","Furniture-Based","Couples Therapy Trigger"], match: 88, award: "Allen Wrench Survivor", awardSub: "Resolved without divorce", desc: "They said the MALM dresser would be easy. They were wrong. A six-hour ordeal documented by the building security cameras.", cast: ["The Couple","An MALM dresser"], genres: ["Drama","Thriller"],
    image: 'images/t06.jpg', },
    { id: 't07', title: "Cooking Disasters: Vol. I", year: 2020, mins: 4, rating: 'TV-PG', tags: ["Smoky","Optimistic","Smoke-Detector-Adjacent"], match: 76, award: "Fire Marshal Nominated", awardSub: "3 alarms triggered", desc: "An ambitious soufflé. A confident roast. The pasta water that boiled over and changed everything.", cast: ["The Couple","A 9V smoke alarm"], genres: ["Comedy","Reality"],
    image: 'images/t07.jpg', },
    { id: 't08', title: "Road Trip 2019: Lost In Utah", year: 2019, mins: 7, rating: 'TV-14', tags: ["Scenic","GPS-Free","Snack-Driven"], match: 93, award: "Mileage Achievement", awardSub: "2,847 miles in a Civic", desc: "They had directions. They had snacks. They had each other. They did not have cell service for 14 hours.", cast: ["The Couple","A 2007 Honda Civic"], genres: ["Adventure","Drama"],
    image: 'images/t08.jpg', },
    { id: 't09', title: "The Dog Custody Saga", year: 2021, mins: 5, rating: 'TV-PG', tags: ["Heartwarming","Furry","Mildly Manipulative"], match: 96, award: "Best Boy Approved", awardSub: "Tail wag rating: 11/10", desc: "A rescue named Biscuit. Two homes. One golden retriever determined to live the dream in both apartments simultaneously.", cast: ["Biscuit","The Couple"], genres: ["Family","Comedy"],
    image: 'images/t09.jpg', },
    { id: 't10', title: "The Move-In: A Renovation", year: 2022, mins: 6, rating: 'TV-MA', tags: ["Dust-Coated","Budget-Busting","Renoir-Adjacent"], match: 84, award: "HGTV-Adjacent", awardSub: "Came in 312% over budget", desc: "They bought a fixer-upper. The fixer-upper began fixing them. A six-month story of paint, plaster, and quiet desperation.", cast: ["The Couple","A contractor named Greg"], genres: ["Drama","Documentary"],
    image: 'images/t10.jpg', },
    { id: 't11', title: "Friendsgiving: Unhinged", year: 2022, mins: 5, rating: 'TV-MA', tags: ["Wine-Soaked","Argument-Adjacent","Stuffing-Forward"], match: 90, award: "Best Group Text Drama", awardSub: "Banned topics: 6", desc: "Twelve friends. One turkey. Forty-seven side dishes. The pumpkin pie incident is still in litigation.", cast: ["The Couple","The Friend Group"], genres: ["Comedy","Drama"],
    image: 'images/t11.jpg', },
    { id: 't12', title: "Dating Apps: A Survivors Tale", year: 2015, mins: 4, rating: 'TV-MA', tags: ["Pre-Relationship","Cringe-y","Educational"], match: 79, award: "Swipe Hall of Fame", awardSub: "Most red flags ignored", desc: "Before they found each other, there was a wasteland. A montage of bad coffee dates and one truly memorable man named Brad.", cast: ["Various Brads"], genres: ["Comedy","Horror"],
    image: 'images/t12.jpg', },
    { id: 't13', title: "The Karaoke Sessions", year: 2023, mins: 3, rating: 'TV-14', tags: ["Tone-Deaf","Confident","Power-Ballad-Forward"], match: 82, award: "Mariah Nodded", awardSub: "1 microphone retired with dignity", desc: "No song was safe. No key was hit. A retrospective of every karaoke night that should have ended an hour earlier.", cast: ["The Couple","A wireless SM58"], genres: ["Musical","Comedy"],
    image: 'images/t13.jpg', },
    { id: 't14', title: "Couples Therapy: Just Kidding", year: 2021, mins: 4, rating: 'TV-MA', tags: ["Reflective","Mildly Unhinged","Communication-Adjacent"], match: 86, award: "Self-Help Aisle MVP", awardSub: "Cited 4 podcasts", desc: "A check-in episode in which our heroes attempt vulnerability. They use the word \"boundaries.\" A houseplant was reportedly returned.", cast: ["The Couple"], genres: ["Drama","Comedy"],
    image: 'images/t14.jpg', },
    { id: 't15', title: "First Apartment Wars", year: 2017, mins: 5, rating: 'TV-MA', tags: ["Pre-Marital","Studio-Sized","Toothpaste-Adjacent"], match: 89, award: "Lease Survivor", awardSub: "650 sq ft. of love", desc: "A walk-up. A futon. One bathroom. Two toothbrushes. The early years, in 1080p emotional resolution.", cast: ["The Couple","A landlord named Phil"], genres: ["Drama","Comedy"],
    image: 'images/t15.jpg', },
    { id: 't16', title: "The Honeymoon: Pilot", year: 2025, mins: 5, rating: 'TV-PG', tags: ["Sun-Soaked","Cocktail-Forward","Phone Off"], match: 99, award: "Out-of-Office", awardSub: "PTO maximized", desc: "They earned this. A pilot episode set on a beach with no Wi-Fi, no schedule, and exactly one piña colada too many.", cast: ["The Couple"], genres: ["Romance","Travel"],
    image: 'images/t16.jpg', },
    { id: 't17', title: "How To Annoy Your Partner", year: 2024, mins: 3, rating: 'TV-MA', tags: ["Tutorial","Petty","Affectionate"], match: 95, award: "Petty Excellence", awardSub: "Dishwasher loaded incorrectly: 47 times", desc: "A masterclass in low-stakes warfare: leaving 1% on the phone, loading the dishwasher wrong, and other acts of love.", cast: ["The Couple"], genres: ["Comedy","Educational"],
    image: 'images/t17.jpg', },
    { id: 't18', title: "The Engagement Photos", year: 2024, mins: 4, rating: 'TV-PG', tags: ["Golden Hour","Sweaty","Coordinated Outfits"], match: 92, award: "Most Reshoots", awardSub: "1,247 shutter clicks", desc: "Behind the scenes of the photo shoot that took 5 hours, 3 outfit changes, and ended in tears (happy ones, probably).", cast: ["The Couple","A photographer named Lena"], genres: ["Documentary","Comedy"],
    image: 'images/t18.jpg', },
    { id: 't19', title: "The Vows (Working Draft)", year: 2026, mins: 6, rating: 'TV-PG', tags: ["Earnest","Drafted 17 Times","Tear-Spec"], match: 100, award: "Best Original Writing", awardSub: "Nominated by everyone in attendance", desc: "A behind-the-scenes look at the vow-writing process. Coffee-stained pages, deleted bits, and the one joke that almost made the final cut.", cast: ["The Couple","A leather journal"], genres: ["Drama","Romance"],
    image: 'images/t19.jpg', },
    { id: 't20', title: "Forever: Season 1", year: 2026, mins: 8, rating: 'TV-PG', tags: ["Limitless","Sentimental","Renewed for Life"], match: 100, award: "Series Renewal", awardSub: "Renewed for ∞ seasons", desc: "The pilot episode of the greatest series ever greenlit. Currently in production. Casting wrapped. No spoilers.", cast: ["The Couple"], genres: ["Romance","Drama"],
    image: 'images/t20.jpg', }
  ],

  rows: [
    { id: 'r1', title: "Continue Watching", ids: ["t02","t09","t16","t19","t08","t20"] },
    { id: 'r2', title: "Critically Roasted", ids: ["t03","t04","t06","t13","t11","t17","t07"] },
    { id: 'r3', title: "Top 10 Wedflix Originals", ids: ["t20","t19","t02","t16","t01","t09","t08","t18","t05","t10"], top10: true },
    { id: 'r4', title: "Romantic Disasters", ids: ["t01","t12","t15","t14","t06","t11"] },
    { id: 'r5', title: "Because You Watched \"The Proposal\"", ids: ["t19","t20","t16","t18","t08","t09"] },
    { id: 'r6', title: "Unhinged Comedies", ids: ["t03","t04","t13","t17","t07","t11","t12"] },
    { id: 'r7', title: "New Releases", ids: ["t19","t20","t18","t03","t04","t16","t17"] }
  ],

  // Procedurally generated tile gradient — fallback when no image is set.
  posterGradient(id) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
    const h2 = (h + 40) % 360;
    return `linear-gradient(135deg, oklch(0.35 0.18 ${h}) 0%, oklch(0.18 0.12 ${h2}) 100%)`;
  },
};
