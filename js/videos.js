// Сгенерировано tools/find-videos.mjs: короткие ролики, проверенные на встраивание
const VIDEOS = {
  "wrist-warmup": {
    "id": "ehzLCRfGnmM",
    "title": "Wrist Warm Up Routine 🤝🏾 #warmup #calisthenics #explore #workout #shorts",
    "author": "Chuks Samuel",
    "seconds": 15
  },
  "cat-cow": {
    "id": "JWFW0ikS7BY",
    "title": "10-Second Cat-Cow Stretch 🧘‍♀️ | Easy Yoga for Beginners #Shorts",
    "author": "ZenFlow Yoga",
    "seconds": 10
  },
  "worlds-greatest": {
    "id": "OCXMbIzYJTQ",
    "title": "World's Greatest Stretch",
    "author": "Evolution Physical Therapy & Fitness",
    "seconds": 9
  },
  "band-pull-apart": {
    "id": "appONHxvQJQ",
    "title": "Band Pull-Aparts 💪 | Posture Fix #Shorts",
    "author": "Ak Pass",
    "seconds": 10
  },
  "scap-pullup": {
    "id": "nw-FIMwCkLs",
    "title": "Scapular Pull ups . Build for Back.",
    "author": "fitness teach 07",
    "seconds": 8
  },
  "dead-hang": {
    "id": "XPcT3capkyk",
    "title": "Dead Hang Hold",
    "author": "Movement Physio",
    "seconds": 8
  },
  "hip-flexor-stretch": {
    "id": "XNFKHpPqwTI",
    "title": "1/2 Kneeling 3-Way Hip Stretch (hip flexor / groin)",
    "author": "Michael Brasch",
    "seconds": 17
  },
  "pigeon": {
    "id": "6b2eFfDb4AA",
    "title": "Pigeon Pose Looks Different for Every Body #yogashorts #mobility #mindfullnesspractice #yogapostures",
    "author": "Jasmynn_RDN",
    "seconds": 10
  },
  "child-pose": {
    "id": "zOI7ZDRn0wU",
    "title": "Child’s Pose for Relaxation 🧘 | Quick Yoga Stretch #healthylifestyle #activelifestyle",
    "author": "Smart Daily Lab",
    "seconds": 10
  },
  "hamstring-stretch": {
    "id": "YE5sHkv3MVA",
    "title": "15. Lying Hamstring Stretch With Band",
    "author": "24Life",
    "seconds": 14
  },
  "goblet-squat": {
    "id": "_T4UOfLsGR8",
    "title": "Goblet Squats 🩵 | Leg Day With Mira #Shorts",
    "author": "Ak Pass",
    "seconds": 10
  },
  "reverse-lunge": {
    "id": "Q2k3kYbtOcI",
    "title": "Dumbbell Reverse Lunge",
    "author": "OPEX Fitness",
    "seconds": 12
  },
  "bulgarian-split-squat": {
    "id": "_HukgYk7lTw",
    "title": "How far should your foot be on Bulgarian split squat?",
    "author": "TylerPath",
    "seconds": 11
  },
  "step-up": {
    "id": "5JbUYumlLCI",
    "title": "Dumbbell Bench Step Ups (Quad Dominant)",
    "author": "be.FIT by Sarah",
    "seconds": 15
  },
  "db-rdl": {
    "id": "ihwOJ9AOgAg",
    "title": "Romanian Deadlift: Push Hips Back #Shorts",
    "author": "HDApps07",
    "seconds": 8
  },
  "single-leg-rdl": {
    "id": "s32cCgmRV3I",
    "title": "Single Leg Kettlebell Romanian Deadlift (RDL)",
    "author": "Movement Physio",
    "seconds": 9
  },
  "leg-extension": {
    "id": "t8--Y-pjTmg",
    "title": "Seated Leg Extension Machine",
    "author": "Arbour Athletics",
    "seconds": 8
  },
  "leg-curl": {
    "id": "FRy58-v0YII",
    "title": "Lying Leg Curl Machine settings for Beginners..✅ #gym #fitness #bodybuidling #workout",
    "author": "Aakash Wadhwani",
    "seconds": 9
  },
  "calf-raise": {
    "id": "ADITZCcUyVo",
    "title": "DB Calf Raises",
    "author": "Derek Ward",
    "seconds": 9
  },
  "cossack-squat": {
    "id": "iPZNB5GsOnM",
    "title": "Cossack Squat Movement Demo",
    "author": "The Active Life",
    "seconds": 16
  },
  "box-pistol": {
    "id": "4yvWPos4ark",
    "title": "Alt box pistol squat",
    "author": "Solid Rock Personal Training",
    "seconds": 11
  },
  "jump-squat": {
    "id": "IfqrxS_-8oU",
    "title": "Jump Squats",
    "author": "Girls Gone Strong | Women's Health & Fitness",
    "seconds": 8
  },
  "glute-bridge": {
    "id": "LEdVLzF6kR0",
    "title": "Fix Your Glute Bridge In 5 Seconds At Home #gym #fitness #homeworkout #workout #motivation #tips",
    "author": "Artem Davidchenko | Online Fitness Coach",
    "seconds": 8
  },
  "hip-thrust": {
    "id": "3BNb5Lcyksc",
    "title": "Dumbbell bench hip thrust",
    "author": "Joe Burke Fitness",
    "seconds": 10
  },
  "banded-walk": {
    "id": "N28Hpdezg7Q",
    "title": "Banded Lateral Walks",
    "author": "Tom Pfeiffer Fitness",
    "seconds": 11
  },
  "donkey-kick": {
    "id": "VZFHfGNEcxM",
    "title": "Banded Donkey KIcks",
    "author": "Tiffany LeRoy - Envision Personalized Training",
    "seconds": 9
  },
  "db-bench": {
    "id": "4_Emue49XAc",
    "title": "How to Dumbbell Bench Press Perfect EVERY Time ✅ #Shorts #DumbbellBenchPress #ChestTraining",
    "author": "THE GYM SM",
    "seconds": 17
  },
  "incline-db-press": {
    "id": "RDFL4Bh2SSY",
    "title": "Incline Dumbbell Press: Perfect Form for Upper Chest Growth! 🔥 #shorts",
    "author": "Muscle Mechanics",
    "seconds": 10
  },
  "db-fly": {
    "id": "NPpxSKOvMwE",
    "title": "\"Master the Dumbbell Chest Fly: Avoid These Errors!\"#shorts #fitneess #motivation",
    "author": "KC FITNESS",
    "seconds": 8
  },
  "incline-pushup": {
    "id": "hTm9vkhNCec",
    "title": "Incline push ups",
    "author": "Tone It Down",
    "seconds": 10
  },
  "db-pushup": {
    "id": "e3Q_QqAAUa8",
    "title": "Why push-ups on dumbbells?",
    "author": "Alex Crockford",
    "seconds": 8
  },
  "pushup": {
    "id": "Jgt4TPA2CMM",
    "title": "How To Do Perfect Push-up 🔥 #ytshorts #ytindia #shorts #exercises #fitness #motivation #viral #yoga",
    "author": "Inder",
    "seconds": 21
  },
  "deficit-pushup": {
    "id": "Rc2Y1RzbxqA",
    "title": "DEFICIT PUSH UPS",
    "author": "THE BAR Fitness Collective",
    "seconds": 11
  },
  "bench-dip": {
    "id": "larQGD02ndE",
    "title": "Bench Dips",
    "author": "Team Training Day",
    "seconds": 9
  },
  "band-dip": {
    "id": "yd3bFBUFYZI",
    "title": "Band-Assisted Dips (demonstration)",
    "author": "KB Fitness - Kurtis Ackerman",
    "seconds": 12
  },
  "negative-dip": {
    "id": "Fl3cOS0g-J0",
    "title": "Negative Dips ✅️ or ❌️ #gymtips #dips #strength #calisthenics #beginner #triceps #shorts",
    "author": "Brandon Kaila",
    "seconds": 18
  },
  "dip": {
    "id": "y44-P1nKKp8",
    "title": "Chest Dips vs Triceps Dips: Know the Difference  #shorts",
    "author": "COACH PRINCE",
    "seconds": 8
  },
  "one-arm-row": {
    "id": "H127qnBvFrM",
    "title": "✅Do vs Don’t ❌ Single Arm Dumbbell Row. #dumbbellworkout #back #backworkout",
    "author": "DilekFit",
    "seconds": 8
  },
  "chest-supported-row": {
    "id": "0-DXJiceG-0",
    "title": "Chest Supported Incline Dumbbell Row - OPEX Exercise Library",
    "author": "OPEX Fitness",
    "seconds": 14
  },
  "db-pullover": {
    "id": "Datv2L6t3-4",
    "title": "❌ You're Doing Dumbbell Pullovers WRONG!",
    "author": "Andrew Kwong (DeltaBolic)",
    "seconds": 8
  },
  "band-pulldown": {
    "id": "nmY4MTSFln8",
    "title": "Lat Pulldown with Resistance Band",
    "author": "Digg Deep Fitness & Nutrition",
    "seconds": 37
  },
  "band-pullup": {
    "id": "3aRP4o23HXo",
    "title": "Band Assisted Strict Pull Ups",
    "author": "Live to Thrive",
    "seconds": 18
  },
  "negative-pullup": {
    "id": "qc1nl8K5uVk",
    "title": "Negative Pull-Ups with Jump",
    "author": "Clayton Echard",
    "seconds": 10
  },
  "pullup": {
    "id": "ImU9MrpIrlY",
    "title": "The ONLY Tutorial you need for the PERFECT PULL UP✅ #motivation #calisthenics #mobility",
    "author": "Stefano Bertola",
    "seconds": 12
  },
  "neutral-pullup": {
    "id": "hTt6kraMk9Y",
    "title": "Neutral Grip Pull-Ups #shorts",
    "author": "Oakland Calisthenics",
    "seconds": 10
  },
  "chinup": {
    "id": "jIvbJzs1V4I",
    "title": "Chin ups #howtoexercise #chinups #upperbodyworkout",
    "author": "FIT Sisters - Lucy & Rosie",
    "seconds": 8
  },
  "superman": {
    "id": "HvdLRWBprws",
    "title": "Prone YTW",
    "author": "Flood City Performance",
    "seconds": 9
  },
  "seated-db-press": {
    "id": "FghebqCF_o8",
    "title": "Seated Dumbbell Shoulder Press",
    "author": "Coach Mark",
    "seconds": 8
  },
  "arnold-press": {
    "id": "Kg8JD8l6ezw",
    "title": "Seated Arnold Press",
    "author": "SDE Method",
    "seconds": 9
  },
  "lateral-raise": {
    "id": "Kl3LEzQ5Zqs",
    "title": "The Perfect Lateral Raise (DO THIS!)",
    "author": "Andrew Kwong (DeltaBolic)",
    "seconds": 8
  },
  "rear-delt-fly": {
    "id": "LsT-bR_zxLo",
    "title": "The PERFECT Dumbbell Rear Delt Fly (DO THIS!)",
    "author": "Andrew Kwong (DeltaBolic)",
    "seconds": 11
  },
  "face-pull": {
    "id": "1s-0WtJMsu8",
    "title": "Banded Face-pull",
    "author": "Movement Physio",
    "seconds": 11
  },
  "band-external-rotation": {
    "id": "IxYWHrLb75k",
    "title": "Mini Band External Rotation",
    "author": "NeuStrength | Personal Trainer Wilmington NC",
    "seconds": 8
  },
  "pike-pushup": {
    "id": "UalsVVpBacw",
    "title": "How to Do Master the Pike Push-Up #fitness #shorts",
    "author": "Hyb Nitin",
    "seconds": 16
  },
  "db-curl": {
    "id": "MKWBV29S6c0",
    "title": "PERFECT Bicep Curl Form Tips",
    "author": "Andrew Kwong (DeltaBolic)",
    "seconds": 8
  },
  "hammer-curl": {
    "id": "BQRMchZZJ78",
    "title": "Hammer Curl Workout 💪 Best Biceps Exercise for Bigger & Stronger Arms | Step 5 #Shorts",
    "author": "Fitness Hack 100k",
    "seconds": 10
  },
  "preacher-curl": {
    "id": "LUBgyjKCRWQ",
    "title": "Bench angle for PREACHER CURLS",
    "author": "TylerPath",
    "seconds": 9
  },
  "overhead-triceps": {
    "id": "AYqg9S5FrUU",
    "title": "📌Dumbbell Overhead Triceps Extension | Nail Your Form👌",
    "author": "SquatCouple",
    "seconds": 11
  },
  "skull-crusher": {
    "id": "lHXWJxSPVC8",
    "title": "Dumbbell Skull Crushers: No Cheating, Better Triceps! 🔥💪 #shorts",
    "author": "fitwithsuryaofficial",
    "seconds": 8
  },
  "band-pushdown": {
    "id": "PtHlGbiCglY",
    "title": "Triceps Pushdown Mistakes ❌ | Fix Your Form with Resistance Bands 💪",
    "author": "Go with JO FITNESS",
    "seconds": 10
  },
  "dead-bug": {
    "id": "Z4MiU1phK68",
    "title": "How to Actually build Your Core with Dead Bug exercise. Workout training  program in bio",
    "author": "Gymbro001 | Workout Form & Muscle Growth",
    "seconds": 8
  },
  "forearm-plank": {
    "id": "tLolc-uob4A",
    "title": "Forearm Plank: Perfect Form for a Stronger Core #Shorts",
    "author": "Reps & Curves",
    "seconds": 8
  },
  "side-plank": {
    "id": "BtM0a9x1F5o",
    "title": "Side plank proper form #fitness #shorts",
    "author": "Nerd Fitness",
    "seconds": 10
  },
  "bird-dog": {
    "id": "knsOPG88idk",
    "title": "Bird Dog - Hold",
    "author": "Performance Outpost",
    "seconds": 8
  },
  "hollow-body": {
    "id": "A1bBVNRMV9o",
    "title": "Hollow Body Hold",
    "author": "FITGET APP",
    "seconds": 8
  },
  "reverse-crunch": {
    "id": "eX9vjAsdWvY",
    "title": "Reverse Crunch - Proper Form To REALLY Train your Abs! #abs #core",
    "author": "dailyglowwithme",
    "seconds": 10
  },
  "russian-twist": {
    "id": "-cPtvFdT8dc",
    "title": "russian twist #shorts  #youtubeshorts #gym 🥳🥳🥳",
    "author": "A2Z",
    "seconds": 9
  },
  "pallof-press": {
    "id": "99evyH71IWs",
    "title": "Band Pallof Press",
    "author": "Queens University of Charlotte Sports Performance",
    "seconds": 8
  },
  "hanging-knee-raise": {
    "id": "MxsRi8dtzmU",
    "title": "Hanging Knee Raises 💪",
    "author": "Tim Thies",
    "seconds": 10
  },
  "hanging-leg-raise": {
    "id": "w0IqM0-3Oso",
    "title": "Abdominal exercises are hanging leg raises #motivation #gym",
    "author": "Hulkcn 💪",
    "seconds": 10
  },
  "tuck-lsit": {
    "id": "I1Z2dsOOl-w",
    "title": "L-Sit on Parallel Bars: Strength Takes Practice 💪 #Shorts #balancefitness #flexibility #gymexercise",
    "author": "Hue Burst Stunts",
    "seconds": 10
  }
};
