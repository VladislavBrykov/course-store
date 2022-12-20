import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

import { Episode } from '@cms/game/episode/episode.entity';
import { Trait } from '@cms/utilities/trait.enum';
import { ContentTypeEnum } from '@cms/utilities/content-type.enum';
import { _ } from '@cms/utilities/lodash';
import { EpisodeStage } from '@cms/game/episode-stage/episode-stage.entity';

const episodes = {
  episode3phy: {
    welcome:
      "Hey, gato.\nThis is LaserSolo. I run the Bouncing Isaacs Squad. We specialize in mechanics. Classical, quantum, nano. You name it, we know it. Boss Sparky called us in because the Punk Robots Squad hacked the service elevator that goes to WormWood's Lucky Lab, but as soon as the elevator doors opened they ran into a bit of a snag. An annoying LED widget inside the elevator is asking a security challenge.\nWe tried to reverse-engineer how this service elevator works to bypass that toy, but the mechanism is inside a thick cement cage. Out-lucked. Our only option is to answer the security question.\n",
    challenge:
      'Two Bouncing Isaacs got into the elevator and saw the following message scrolling  on the LED widget over and over.\n"Daily security check. Note 1045-53.\nWeight = 1225 N.\nInput appropriate Beta."\n',
    question:
      "Can you figure out what this Beta cosa is? There is a number pad next to that LED widget so maybe it's a number? The number pad has  digits 0-9 and the LED is blinking with 0.xxx on the screen. Looking for a number smaller than 1 with three significant digits I think!\n",
    success:
      "The Bouncing Isaacs owe you congrats. You did it, gato! The elevator is movin' now. It goes down all the way to -103 floors below! Loco! The Punk Robots Squad will take it from here. We will ping you when we run into a problem. LaserSolo out!\n",
    error:
      'Not to sound nervoso or anything but the little elevator gadget spit out a polite error saying it will shut down the system if we fail two more times. No pressure!\n',
    codewordClues: [
      'A force.',
      'Apple fell from a tree.',
      'Hit his head.',
      'Newton',
    ],
  },
  episode1: {
    welcome:
      "My name is Willow Nagata and I live five centuries ahead of your space-time. The times are dark! The founder of WormWood Corporation, Dr. Wolfgang William WormWood, has enslaved humanity.  Now he is like a god! No one can touch him because he destroyed the whole global data inter-network centuries ago and with it his personal secrets of power.\nI am a member of SeSoLT, the Secret Society of the Long Tomorrow, a group of agents fighting against WormWood. Our only chance in defeating him is to search in your space-time and dig out his past.  That's why we worked hard for five decades to invent this Quantum Channel and hide it inside his recruiting game. We have been waiting for someone like you for a whole century to open it up!\nI wish I could tell you more but there is no time. Please see the challenge and help us.\n",
    challenge:
      "No one knows when and how exactly...but WormWood turned all humans into obedient servants  by using a nano-virus that took over someone's brain functions when a human came in contact.\nNow he is planning something even worse! A nano-virus that can read someone's inner thoughts.  With a weapon like that he will discover our hidden identity! Our mission is to stop him before he finishes the virus.\nOne of our agents discovered that the design specs of the mind-reading virus are hidden in a secret vault in one of his offices. The problem is WormWood has hundreds of offices  spread in every major city!!\nOur agent lost her life before she could find the name of the city but she was able to intercept this message from WormWood “...load note bit.ly/wwww55-01 into my brain...”\n",
    question:
      'We need to find which city WormWood is keeping the virus designs. Please send me the name  once you figure it out by typing it in the channel.\nIt will take us a few days to check and I will get back to you. Because this is a quantum entanglement time channel I will transmit our response back in your current time so you only have to wait a few seconds.\nWhat is the name of the city?\n',
    success:
      "New York, yes! We were able to find some threads of information about New York and the mind-reading virus  so I think you may have found the correct city. Thank you!\nTo safeguard this channel from WormWood spies we use codewords. For  extra security, we don't allow a single person to know the codeword so I will give you a clue. Use the clue with your fellow agents in your time-space to discover the next codeword together. A new challenge awaits!\n",
    error:
      'We sent a SeSoLT agent there but could not find any information relevant to the virus.  Are you sure this is the right city?\n',
    codewordClues: [
      'from the ascii table.',
      'in hex',
      'It is a number',
      'What is the code for space?',
    ],
  },
  episode2: {
    welcome:
      "We sent a SeSoLT agent to NYC to find more details.  It turns out that the WormWood Corporation has 121 known locations in NYC however! So we need to narrow down which one. There is one bit of information that we discovered about WormWood that now seems relevant. It's only possible to make use of that information in your own time-space. That's why we need your help. See the challenge for more information.\n",
    challenge:
      'WormWood holds weekly meetings with his head scientists on the 92nd floor of his residence. During the last meeting one of the scientists noticed an old strange-looking box in the room and asked WormWood about it. WormWood said this is a box he built when he was a young child in NYC and said only he knows how to open it.\nΤhe scientist asked him what he had inside. WormWood did not answer. During the meeting Dr. Sparky memorized the label on the box.  (Dr Sparky is our leader. I will tell you about "the Doc" another time however).\n“bit.ly/wwww101-37”\nThe Doc said the box had 1 lock/unlock switch and a password device with 8 letter-wheels. The Doc also said he has not seen the scientist who asked the question since that meeting. He seems to have disappeared. I personally don\'t think that is a coincidence. As I mentioned, we live in dark times. WormWood will do anything to protect his secrets.\n',
    question:
      'I hope you can find how we can open that box. WormWood might be getting suspicious and move the box. Please send me the answer like this (use a comma):\n[LOCK|UNLOCK], 8-letter-password\n',
    success:
      "Dr. Sparky sent us a secret message that he opened the box. Thank you! He said he needs to go back to his regular job for a few hours so WormWood doesn't get suspicious  and then he will share the contents of the box with us. In the meantime, we are sending you a clue for the next codeword. When we learn more from the Doc we will send you the information once you find the next codeword. \n",
    error:
      'We could not open the box. Thankfully we were able to treat Dr. Sparky after he got electrocuted. Please try to be careful!\n',
    codewordClues: [
      'Transistors are made from it.',
      '...its atomic number.',
      'Check Periodic Table for...',
      'Famous Valley.',
    ],
  },
  episode3: {
    welcome:
      'Dr. Sparky told us what was in the box. There were pictures of WormWood as a child and what appears to be his mother in various locations in NYC.\nWhat I say next will shock you. We need your help. See your next challenge!\n',
    challenge:
      "There was a disturbing picture of WormWood's mother in a lab sitting on a chair  with her head connected with wires to a machine.\nOn the back of the photo was a note “Brain Trial number 2056. Success finally! My Lucky Lab! bit.ly/wwww999-39. Thanks, Mom!”. \nWas WormWood really doing brain experiments using his own mother?? We are shocked!\n",
    question:
      'Please search in your time-space and find the address in NYC.  We suspect this is what WormWood calls the "Lucky Lab".\nSend us the address in canonical format: <number> <street/avenue name> New York, NY <zipcode>\n',
    success:
      'You are our secret weapon! The address you sent us looks legitimate. It matches some other information we discovered. We plan to send an agent to this address to find out more. Find the next codeword using the clue I will send you and we will share any new information when you use it to log in. \n',
    error:
      'We could not find any office owned by WormWood there. Are you sure?\n',
    codewordClues: [
      '...the output is 0.',
      'If both inputs are the same...',
      'It is Exclusive.',
      'A transistor gate.',
    ],
  },
  episode4: {
    welcome:
      "We sent someone to check the place. Our agent saw that to pass through the front entrance one has to go through a DNA scanning gate. She looked for a way to trick the DNA scanner but no luck. It will take us multiple years to generate a fake DNA signature.\nWe didn't give up though. She volunteered to go to the office again but this time she walked around the block and into a back alley. She looked under a pile of trash and noticed a small  service door that she believes leads into the building.\nBut she ran into a problem and we think you can help us. See the challenge.\n",
    challenge:
      'There seems to be some voice activated lock on that door. It looks like you need to speak to it a passphrase to open. It also looks like really really old technology. We suspect it\'s a pre-EOI (End Of Internet) device.\nDr.Sparky took a big risk. One day when WormWood was looking through some of his old notes in his childhood diary,  the Doc managed to get a few seconds alone with the diary and flipped through it in the hope of finding useful information. He memorized something interesting:\n"service door brain teaser bit.ly/wwww1007-47"\n',
    question:
      'We hope the information Dr. Sparky gathered can help you find the passphrase of the pre-EOI device. Please type it here.\n',
    success:
      'The passphrase worked! You are the best! Our agent is able to enter the building.  We will gather information and reach out to you if we run into a problem. Use the clue for the next codeword to contact us.\n',
    error: "The passphrase you sent didn't work. Are you sure?\n",
    codewordClues: [
      '3-band resistor color code.',
      '1st is orange.',
      '2nd is green.',
      'Multiply by brown and forget Omega.',
    ],
  },
  episode5: {
    welcome:
      "I'm afraid I don't have good news.\nOur agent was able to enter one night into the building through the service door. She searched the whole building, even took the elevator to every floor, but there was nothing that looked like WormWood's Lucky Lab.\nWe are worried that maybe we are not at the right building after all. Unless you help us we will lose precious time if we have to start the search from the beginning. I hope you can help us with the next challenge.\n",
    challenge:
      "Our only hope is Dr. Sparky's memory from when he peeked into WormWood's diary last time. He remembered another note that was there but unfortunately not completely. He thinks it was 'wwww' then '1', '0', '1', then another digit he doesn't remember and then  ended in '-55'.\nThat's the only hope we have and I suspect this will be your biggest challenge so far.\n",
    question:
      'Maybe there is a clue in your time-space about how to access the lab. Can you please tell us how to find it when we are inside? Send us the answer exactly as you find it.\n',
    success:
      'Unbelievable! After our agent turned the water on/off in the bathroom the wall melted away as if it was made from nano-particles and a secret elevator appeared!\nWe plan to figure out how to use the elevator without alerting any attention  and if we run into a problem we will let you know after you enter the next codeword.\n',
    error:
      'We could not find the entrance using your instructions. Are you sure?\n',
    codewordClues: ['20', 'plus', '11', '5-bit encoding'],
  },
  episode6: {
    welcome:
      "Hello my choomba.\nThis is ZeroOut again from the Punk Robots Squad. After we opened up the hidden entrance we thought it would be a joyride, but WormWood's elevator is a foxy little nano-magnet fortress. A good-be squadie though found an ancient service elevator so maybe our luck is back.\nThere was an old discarded card on the floor with a fingerprint reader installed in it. The elevator has zero buttons. Just a locked door and a slot that may be for inserting the card. We need your help again, choomba, to figure out how to open that door. Sending you the challenge.\n",
    challenge:
      'We decided not to insert the card in case it alerts security, especially because the back of the card has "wwww1037-0" written on it.\nMy squadie, though, could loosen up the area around the card slot and she saw an ancient device inside it that is connected to six wires: Red, Blue, White, Yellow, Purple, and Green. The wires continue inside the concrete wall. We think the device reads the card and then activates the wires in a sequence, but our agent thinks to use a portable micro-battery to activate the wires and get the elevator movin.\n',
    question:
      'If we can activate the wires one after the other in the right sequence, we may be able to get the elevator to move. Can you check if WormWood left any clues in your worldline about the right sequence? Please use the first letter of each color (RBWYPG) and send  us the sequence like this example:\nRRBYYGGGGW\n',
    success:
      "The sequence worked, choomba! You've helped us come this far. Mev Sparky heard all about it and she told me I can share more with you. There is only one reason WormWood wants all this power. He wants to control humans. He has them living a happy life on the Out and be in harmony with the planet and not cause any trouble, you see?\nHe used nanotech and micro-time reversals to expand his lifespan into hundreds of years. The only other humans who can live as long as this guy are his employees at the WormWood Corporation.\nWormWood employees are the brightest minds he has managed to find. And he has injected them with a virus to control their minds. He also gave them the ability to live beyond normal lifespans like himself so they can help him run his experiments.\nI will share more later. For now, we will investigate a bit more and let you know after you enter the next codeword.\n",
    error:
      'The elevator did not move. Are you sure you gave us the correct sequence?\n',
    codewordClues: ['latest', 'Internet', 'version', 'Protocol'],
  },
  episode7: {
    welcome:
      'The elevator took our agent deep underground. When the door opened she was shocked with what she saw.\nThe first thing she noticed was a strange acidic smell and how warm the room was. It was not so much a small room. It was a large chamber instead.\nThen she noticed the awful leather chairs. They had straps to tie one\'s feet, arms, and neck. The chairs had scratches from human nails. There was a large hole inside each head-rest  with hundreds of tiny needles around it and thin cables sticking out on the other side. Dr. Sparky verified  that these were the chairs in the pictures from WormWood\'s childhood metal box when WormWood was experimenting  on his own mother. This is *definitely* the "Lucky Lab".\nThat place was really creepy but then things got worse when our agent figured out where that awful smell was coming from...\n',
    challenge:
      'She noticed a deep pit that was filled with a thick bubbling liquid. High up above the pit were 4 human size pods hanging. One made of steel, one of stone, one of plastic and one of wood. There was a pre-EOI computer station in front of the pit but it\'s password protected with a hint "My favorite superhero".\nWe took this information to Dr.Sparky. After much thought he said it reminded him a quiz  WormWood gave him many years ago about building a bridge.\n',
    question:
      'We definitely need to figure out what the pods are used for but for now we need to figure out how to login to this computer. Our only chance is for you to find that clue in the past. What password should we try to login to the computer station?\n',
    success:
      "You found the login for the computer!\nLet me tell you more about SeSoLT.\nAs I said before, WormWood injected a mind-controlling virus to WormWood employees. The virus binds to the human brain like a lock. Until it is unlocked the employee will live in a continuous dream state created by the signal the virus is sending to the brain. This way WormWood transmits his ideas to his employees and they believe it's their own idea.\nGuess who was WormWood's first employee. Dr. Sparky. Maybe because WormWood had not perfected the virus at that time or maybe out of pure chance, the virus in Dr. Sparky's brain unlocked by itself. It was a one in 4,294,967,296 probability. But it amazingly happened. And this was the start of SeSoLT and the fight  against WormWood.\nThis is it for now. Use the clue to find the next codeword and I will share with you what we find inside this computer.\n",
    error: "The password you sent did not work. Are you sure it's correct?\n",
    codewordClues: ['The opposite', 'of', 'waterfall', 'development.'],
  },
  episode8: {
    welcome:
      'You found the login for the computer! It looks like pre-EOI technology but we figured how to navigate and look for information. It is difficult however because the information is split into thousands of different locations. \nWe also found out that the smelly liquid in the pit below the pods is like an acid it will melt some things but not others. We suspect it contains a nano-virus. The pods seem to be transport devices to take a single person deeper underground through the smelly acid. This will be a dangerous challenge!\n',
    challenge:
      'Our agent found a location inside the computer software related to activating the pods. There is a program hidden in the computer that needs 3 inputs: the angles of 3 gears to rotate and lower the pod into the acid. There are no instructions on how to find these numbers but thankfully there was a comment inside the program.\nbit.ly/wwww2014-105\n',
    question:
      'What angles are the 3 gears? Please type each number separated by space like this: <angle1> <angle2> <angle3>\n',
    success:
      "The gears moved and the stone pod is in place.\nLet me tell you what happened after Dr. Sparky \"woke up\" from the virus that controlled his mind. He realized how wrong were all the things the WormWood corporation was doing but he couldn't change them alone. He studied the virus for many many decades and realized that the virus's lock was unique for each person. Like a password. He devised an algorithm to break the lock and hid his program inside WormWood's computers. To make sure his program stayed undetected he could only run it at a low speed so he was able to free one person every 13 years. I was the first one. \nThis is it for now. Our agent will figure out how to use the stone pod so please use the clue to find the next codeword and I will tell you what to do next.\n",
    error:
      'The gears rotated and the pod that dropped melted into the acid. It was scary. Are you sure you found the right answer?\n',
    codewordClues: ['Last', 'name of', 'the inventor of', 'Javascript.'],
  },
  episode9: {
    welcome:
      "Let me make this quick and clear. I'm in danger!  WormWood's octopods are looking for me. They are like insectoid robots made from metal and human parts. I took a glimpse when they crawled down from the ceiling. They must be about 2 meters tall  and 4 meters wide with hundreds of tiny fingers. I don't scare easily but these \"creepoctoids\" are creepy!\nI managed to snatch a portable pre-EOI computing device from a desk before they detected me. I have now squeezed into a nook but let's assume they are STILL looking for me. I will explain more when you help me get rid of the creepoctoids.\n",
    challenge:
      'I looked through the ancient device and found a file called "Octopod Guardians". It talks about an emergency shutdown mechanism but the rest looks like an encrypted message:\nsfUaUR8doM w+LXjz/zNX uNMehSclr7 7RV0hrh12S Mg4A5zp9JK\nAs a cryptographer I am guessing it\'s some kind of hash. There was a note in the file that looked like this:\nbit.ly/wwww2211-211\n',
    question:
      "Hey. I want to get rid of these giant robot insects, amigo. Just sent me back the deciphered message. Quick! I can't hide for too long.\n",
    success:
      "Thanks but no thanks, amigo! I disarmed the octopods but only after one managed to stab my leg. It's not a serious wound. Nothing some tequila won't fix.\nOh. I forgot to introduce myself. I'm agent Fei Sanchez, codename 'Shifter7'. I'm a cryptographer.  I volunteered for this mission. Dr. Nagata gave me a portable quantum channel  and I took it with me on my trip here through the acid.  Before the octopods found me I was examining this chamber.  It is full of pipes and wires. It's dark except from the dim pink-purple light coming from  the thousands of floor-to-ceiling columns full of vials containing the virus.  They are buzzing with energy. WormWood is definitely past designing the virus. He is already brewing it. I must destroy it. I will share my findings with Dr. Sparky so he can... \nwait...I hear a noise. Someone is here. Crap. I'll ask the quantum channel to generate a codeword clue for you. Log back in with the new codeword.  I may need your help to destroy the virus!\n",
    error:
      "Your answer doesn't look right, amigo. I'm getting rather uncomfortable here... I can smell the creepoctoids getting closer.\n",
    codewordClues: ["World's", 'first', 'computer', 'bug.'],
  },
  episode10: {
    welcome:
      'This is worse than I thought. WormWood himself has arrived. I\'ve hidden behind some boxes.  He is quite irritated by now and keeps shouting "Where is my lap top!?!".\nBefore WormWood went ballistic I had a little time to dig deeper into his "lap top". There is a document that says  "make sure to keep the radiation frequency for mutation within range and avoid boiling ranges".  I also figured out more information about the virus management system so I can connect to it.\n',
    challenge:
      'There is nothing in his "lap top" talking about any frequency ranges that are "boiling" BUT I just heard him say "Load wwww-virus2000-06 specification into my brain and check health status". I peeked from my box and I see he has brought out a small device to connect his...brain?! Crazy! I bet he is also checking logs to find who breached the system security. I don\'t have much time. I pray to the Gods of Mathematics that you give me a good frequency to boil this sucker.\n',
    question:
      'I\'ve connected his "lap top" to the virus management system. As soon you send me the right frequency in GHz I will reconfigure the system. Send me the right number quickly!\n',
    success:
      "The virus is dead, amigo! It turned yellow then orange and then a huge explosion destroyed all the vials. I wish I could celebrate with you but WormWood is on to me.\nI've contacted Dr. Nakata and she thinks it's too risky to keep the quantum channel open. If WormWood gets his hands on it he could communicate and warn his younger self. The channel has to be destroyed from both ends of the time-space continuum so you need to do your part. She will send you a clue for the next codeword. She has also contacted another agent to leave printed instructions for you when you meet your fellow collaborators. Look for it when you see them next.\nWormWood just shouted \"Thief! I will find you! You can't escape!\". \nI have to go! Good luck!\n",
    error:
      'The virus continuous to looks healthy. Are you sure your answer is correct?\n',
    codewordClues: ['What is', 'Sanchez', 'code', 'name?'],
  },
  episode11: {
    welcome:
      'Well, well, well. How the tables have turned! I assume you are the human on the other side of this communication channel. It is quite a unique quantum entanglement device. It must have taken decades to stabilize. Impressive.\nThe girl that carried the device is dead, mind you. She jumped into the fire. I imagine you are the one who helped her disable my octopods and blow up my precious virus. Little does she know that her fresh brain was still useful to me so I had one of my octopods pick it up from the flames.\n',
    challenge:
      "You see, even though she destroyed my mind-reading virus I do have an early prototype of a  memory-eating version. The side-effect of course is the virus eats the brain. Therefore, I can only use it once per person. She died rather quickly so I could only download a handful of memories. Why Prometheus would betray me I don't know. I alerted the security team but they reported that he and Willow Nagata have disappeared. It's no matter. I will find them soon enough.\nWhat is more interesting is that in her memories the girl had this notion that this channel is communicating through time-space so I have to assume you live in the past. If that were the case, it means you have been poking at MY past. Therefore I should assume that you think I want to keep this channel open as long as possible so  I can contact myself and ask myself to track you down. You would be right at that. I intend to find you!\nYours truly, WWWW.\n",
    question:
      'You should also assume I will try to stop you from destroying this channel. In a few minutes I will be able to send a message through to my past self. \n',
    success:
      '..`````` ``.....::ososyyyssss- `oso:`sho /syhy/-.----:.` `.:osso+/oo-`.:/+/syohdy -++/-`         ``.--.``/+/ohNMNdyoy::sh .....`        `.```.:ohdmMMMMMNNh//::-. o+/-````...````..:oydNNMMMMMMMMNd.---++ .hhs:...--..-..-/osdmNNNMMMMMMNNmdos+/.. /do+/:---::-::::/+ohmNNNMMMMNNNNdooo+-:/ ym/:+++/:////++oyhdmNNNNNNNNNNNd+-/+/ys/ sms++ssyhyyhhddmddmmNNNNNNNNMNMNd/`.-../ yNs+syhdmmmmmmmmddmmNmddmNmmmNNNNd+`     Nh-::/ooydmmydhdddds/---...-:+ydmNmy:-`  s. ..    .:/syo--.```.       `:+ohmmyoo- y:.:.-`     -s/..-:+-`:s+`  ```..-smmmds `m:++y:..``.smdo.`.:/+/:/....-+ydmmNmmdh dMmyo:-`.oomNNds:--.:/++/::/hmMMNmmmdhy `yNMhyo+osodNMMNhys+::/o+++ymNNNmmddhyso `oNdddyyysoMMMMMmdhoosydmdmNNmmdddys+/:: .-NhsyyssshNNMMMMNmmshdmNmmdhhyso+/:--:/ ..+msssyhmmNNMMMNNNm+:smNNNmdy+/----:/oo ..-+mhhmNNMmhyssoyyhy.-odmNNmho:---/+oos ----+mNMNdhhsdhs:.::+mms+sdmmh+:-/++oo+/ :::::+NMmyhdddoo.`-ommmNmyyhddy:-++++/-- //////sNmNMMNmo/:/oyyyhhddhyhhh+::/:-... ooo++++mMMNMMNyymyooss+//ooosyso::-.`..  osssoo+hMdosoo/:....-::....-:/+-..``..   syysoooodNydMNmy/://::::-.``.....---     ssyssosoodMNmdhy/--/+oo+/..````.-.`  ``` osysssssosmMMMNd/-.--:::-..```.`   ``  ` osysssssoyhMMMNho/----:--....`         ` ssssyysssoyhmNNmhs++oyy+//:.     `-    ` yyysyyysssood:ysyhyhhyo/-`        o-     REMEMBER_MY_FACE_WHEN_I_COME_       0\n',
    error:
      'Ha Ha Ha! The link is still open. I just need a little more time and I will track you down!\n',
    codewordClues: ['You cannot escape forever. The future is mine!'],
  },
};

const codewordEpisode = {
  collaboration: 'episode1',
  '20': 'episode2',
  '14': 'episode3',
  XOR: 'episode4',
  '350': 'episode5',
  '11111': 'episode6',
  IPv6: 'episode7',
  agile: 'episode8',
  Eich: 'episode9',
  moth: 'episode10',
  Shifter7: 'episode11',
  Isaac: 'episode3phy',
};

const episodeValidations = {
  episode1: (answer: string) =>
    Boolean(
      ['new york', 'new york city', 'ny', 'nyc'].find(
        (variant) => variant === answer.toLowerCase(),
      ),
    ),
  episode2: (answer: string) => {
    const [first = '', second = ''] = answer
      .split(/,/)
      .map((word) => word.toLowerCase().trim());
    return first === 'lock' && second === 'shockley';
  },
  episode3: (answer: string) =>
    Boolean(
      [
        '100 10th ave, new york, ny 10011',
        '100 10th avenue, new york, ny 10011',
        '100 10th, new york, ny 10011',
        '100 10, new york, ny 10011',
      ].find((valid) => valid === answer.toLowerCase()),
    ),
  episode4: (answer: string) => answer.toLowerCase() === 'lisp',
  episode5: (answer: string) => {
    // answer: when inside go to the wc. turn the hot water on. turn it off. turn the cold water on. turn it off. then again and again and again.
    const validAnswer =
      'when inside go to the wc. turn the hot water on. turn it off. turn the cold water on. turn it off. then again and again and again.';
    const keywords = ['wc', 'hot', 'cold', 'water', 'on', 'off', 'turn'];
    let count = 0;
    if (answer.length == 0) {
      return false;
    }
    for (let i = 0; i < keywords.length; i++) {
      if (answer.includes(keywords[i])) {
        count++;
      }
    }
    return answer === validAnswer || count > 4;
  },
  episode6: (answer: string) =>
    answer === 'GGYGYYGYGGGGGGYGYGGYGGGYGGYGGYGYGGGYGGYGGGGYGGGG',
  episode7: (answer: string) =>
    Boolean(
      ['green goblin', 'the green goblin', 'greengoblin'].find(
        (valid) => valid === answer.toLowerCase(),
      ),
    ),
  episode8: (answer: string) => {
    // answer: gear1=94.2942 gear2=83.4834 gear3=10.8108
    const gearValues = ['94.2942', '83.4834', '10.8108'];
    let count = 0;
    if (answer.length == 0) {
      return false;
    }
    if (answer.split(/\s+/).length != 3) {
      return false;
    }
    for (let i = 0; i < gearValues.length; i++) {
      if (answer.includes(gearValues[i])) {
        count++;
      }
    }
    return count == 3;
  },
  episode9: (answer: string) => 'red button on electrical panel' === answer,
  episode10: (answer: string) => parseInt(answer) === 3845,
  episode11: (answer: string) =>
    Boolean(
      ['GK', 'GEJ', 'GEJ5', 'GEJ/0', 'GEJ014', 'GEJMI36', 'GEJMQ=LR'].find(
        (valid) => valid === answer.toUpperCase(),
      ),
    ),
  episode3phy: (answer: string) => {
    const beta = parseInt(answer);
    return !isNaN(beta) && beta > 0.45 && beta < 0.55;
  },
};

export class SeedEpisodes1650854720221 implements MigrationInterface {
  private readonly episodeRepo = getRepository(Episode);
  private readonly stageRepo = getRepository(EpisodeStage);

  public async up(): Promise<void> {
    type Ep = typeof episodes[keyof typeof episodes];
    const epToCodeword = _.invert(codewordEpisode);
    for (const [name, codeword] of Object.entries(epToCodeword)) {
      const ep = episodes[name] as Ep;
      const validator = episodeValidations[name] as (answer: string) => boolean;
      const episode = await this.episodeRepo.save({
        codeword,
        name,
        isPublished: true,
        episodeStages: [
          {
            isEntryPoint: true,
            trait: Trait.INFO,
            content: {
              contentType: ContentTypeEnum.TEXT,
              texts: [
                {
                  text: ep.welcome,
                },
              ],
            },
          },
        ],
        answerValidators: [
          {
            validatorFunction: validator.toString(),
          },
        ],
      });

      const welcome = _.last(episode.episodeStages);
      const challenge = await this.stageRepo.save({
        trait: Trait.INFO,
        previousStages: [{ id: welcome.id }],
        episode: { id: episode.id },
        content: {
          contentType: ContentTypeEnum.TEXT,
          texts: [{ text: ep.challenge }],
        },
      });
      const question = await this.stageRepo.save({
        trait: Trait.CHALLENGE,
        content: {
          contentType: ContentTypeEnum.TEXT,
          texts: [{ text: ep.question }],
        },
        episode: { id: episode.id },
        previousStages: [{ id: challenge.id }],
      });
      const success = await this.stageRepo.save({
        trait: Trait.SUCCESS,
        content: {
          contentType: ContentTypeEnum.TEXT,
          texts: [{ text: ep.success }],
        },
        episode: { id: episode.id },
        previousStages: [{ id: question.id }],
      });
      const error1 = await this.stageRepo.save({
        trait: Trait.ERROR,
        content: {
          contentType: ContentTypeEnum.TEXT,
          texts: [{ text: ep.error }],
        },
        episode: { id: episode.id },
        rollbackStage: { id: success.id },
        rollbackFrom: [{ id: question.id }],
      });

      // error 2
      const error2 = await this.stageRepo.save({
        trait: Trait.ERROR,
        content: {
          contentType: ContentTypeEnum.TEXT,
          texts: [{ text: 'error 2' }],
        },
        episode: { id: episode.id },
        rollbackStage: { id: success.id },
        previousStages: [{ id: error1.id }],
      });
      error2.nextStage = error2;
      await this.stageRepo.save(error2);
      // clues
      const clue = await this.stageRepo.save({
        trait: Trait.CLUE,
        content: {
          contentType: ContentTypeEnum.CODEWORD_CLUE,
          codewordClues: ep.codewordClues.map((clue) => ({ clue })),
        },
        previousStages: [{ id: success.id }],
        episode: { id: episode.id },
      });
      clue.previousStages.push(clue);
      await this.stageRepo.save(clue);
    }
  }

  public async down(): Promise<void> {
    await this.episodeRepo.delete({});
  }
}
