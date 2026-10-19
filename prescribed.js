// Prescribed words from the Year 7 Chinese study booklet (Amazing Chinese 1).
// Format per line: hanzi | pinyin | english. Earlier lessons win if a word repeats.
// Words are grouped by unit, matching the booklet's reading/writing lists.
const PRESCRIBED_LESSONS = [
  "Unit 1: Myself and My Family (Lessons 1–3)",
  "Unit 2: Personal Background (Lessons 4–6)",
  "Unit 3: Daily Routine and Hobbies (Lessons 7–9)",
  "Unit 4: Food and Drink (Lessons 10–12)",
];
const UNIT_OF_LESSON = [0, 1, 2, 2, 2, 3, 3, 3];
const PRESCRIBED_RAW = [
`我|wǒ|I, me
你好|nǐ hǎo|hello
他|tā|he, him
她|tā|she, her
们|men|plural marker for people
姓|xìng|surname
名字|míngzi|name
叫|jiào|to be called
什么|shénme|what
是|shì|to be
的|de|possessive particle
朋友|péngyou|friend
小|xiǎo|small, little
呢|ne|question particle (used for context)
吗|ma|question particle (yes/no)
年|nián|year
月|yuè|month
日|rì|day, date
今天|jīntiān|today
今年|jīnnián|this year
生日|shēngrì|birthday
快乐|kuàilè|happy
出生|chūshēng|to be born
岁|suì|years old
几|jǐ|how many
多大|duō dà|how old
一|yī|one
二|èr|two
三|sān|three
四|sì|four
五|wǔ|five
六|liù|six
七|qī|seven
八|bā|eight
九|jiǔ|nine
十|shí|ten
百|bǎi|hundred
千|qiān|thousand
万|wàn|ten thousand
不|bù|not, no
大家|dàjiā|everyone
有|yǒu|to have
口|kǒu|mouth; measure word for family members
个|gè|general measure word
人|rén|person
爸爸|bàba|dad
妈妈|māma|mum
哥哥|gēge|older brother
姐姐|jiějie|older sister
弟弟|dìdi|younger brother
妹妹|mèimei|younger sister
兄弟姐妹|xiōngdì jiěmèi|siblings
没有|méiyǒu|don't have
和|hé|and
两|liǎng|two (used with measure words)
谁|shéi / shuí|who
家人|jiārén|family members
这|zhè|this
那|nà|that`,
`国|guó|country
住|zhù|to live
在|zài|at, in, on
中国|zhōngguó|China
美国|měiguó|United States
英国|yīngguó|United Kingdom
法国|fǎguó|France
日本|rìběn|Japan
澳大利亚|Àodàlìyà|Australia
德国|déguó|Germany
泰国|tàiguó|Thailand
韩国|hánguó|South Korea
新加坡|xīnjiāpō|Singapore
意大利|yìdàlì|Italy
西班牙|xībānyá|Spain
外国|wàiguó|foreign country
哪|nǎ|which
对不起|duìbuqǐ|sorry
没关系|méi guānxi|it's okay / no problem
长大|zhǎngdà|to grow up
喜欢|xǐhuan|to like
也|yě|also
还是|háishi|or (in questions)
新|xīn|new
半|bàn|half
北京|běijīng|Beijing
上海|shànghǎi|Shanghai
西安|xī'ān|Xi'an
香港|xiānggǎng|Hong Kong
台北|táiběi|Taipei
悉尼|xīní|Sydney
纽约|niǔyuē|New York
东京|dōngjīng|Tokyo
伦敦|lúndūn|London
巴黎|bālí|Paris
柏林|bólín|Berlin
中文|zhōngwén|Chinese (language)
汉语|hànyǔ|Chinese (spoken language)
英语|yīngyǔ|English
法语|fǎyǔ|French
日语|rìyǔ|Japanese
外语|wàiyǔ|foreign language
会|huì|can, to know how to
说|shuō|to speak
写|xiě|to write
汉字|hànzì|Chinese characters
一点儿|yìdiǎnr|a little bit
学|xué|to study, to learn
看书|kàn shū|to read books
都|dōu|all, both
老师|lǎoshī|teacher`,
`科目|kē mù|subject
课|kè|class, lesson
课程表|kèchéng biǎo|school timetable
中文课|zhōng wén kè|Chinese class
英语课|yīng yǔ kè|English class
数学课|shù xué kè|math class
科学课|kē xué kè|science class
化学课|huà xué kè|chemistry class
物理课|wù lǐ kè|physics class
生物课|shēng wù kè|biology class
美术课|měi shù kè|art class
音乐课|yīn yuè kè|music class
地理课|dì lǐ kè|geography
历史课|lì shǐ kè|history class
体育课|tǐ yù kè|PE
年级|nián jí|grade / year level
第一节课|dì yī jié kè|first period / class
每天|měi tiān|every day
最|zuì|most
喜欢|xǐ huān|to like`,
`起床|qǐ chuáng|get up
洗澡|xǐ zǎo|take a bath / shower
吃早饭|chī zǎo fàn|eat breakfast
上学|shàng xué|go to school
上课|shàng kè|go to class
下课|xià kè|class ends
聊天|liáo tiān|to chat
吃午饭|chī wǔ fàn|eat lunch
放学|fàng xué|finish school
课外活动|kè wài huó dòng|extracurricular activities
打球|dǎ qiú|play ball
回家|huí jiā|to go home
吃晚饭|chī wǎn fàn|eat dinner
做作业|zuò zuò yè|do homework
看书|kàn shū|read book
看电视|kàn diàn shì|watch TV
打电话|dǎ diàn huà|make a phone call
上网|shàng wǎng|go online
玩手机|wán shǒu jī|to play on the phone
打游戏|dǎ yóu xì|play (computer) games
睡觉|shuì jiào|sleep`,
`爱好|ài hào|hobby
运动|yùn dòng|sports / exercise
打球|dǎ qiú|to play ball
篮球|lán qiú|basketball
网球|wǎng qiú|tennis
乒乓球|pīng pāng qiú|table tennis
板球|bǎn qiú|cricket
橄榄球|gǎn lǎn qiú|rugby
高尔夫球|gāo ěr fū qiú|golf
排球|pái qiú|volleyball
羽毛球|yǔ máo qiú|badminton
踢足球|tī zú qiú|play football
跑步|pǎo bù|running, to jog
游泳|yóu yǒng|to swim
唱歌|chàng gē|to sing
跳舞|tiào wǔ|to dance
画画|huà huà|to draw / paint
下棋|xià qí|to play chess
打游戏|dǎ yóu xì|to play video games
上网|shàng wǎng|to surf the internet
学校|xuéxiào|school
学生|xuéshēng|student
早上|zǎoshang|morning
上午|shàngwǔ|late morning
下午|xiàwǔ|afternoon
晚上|wǎnshang|evening
节|jié|period (of class)
明天|míngtiān|tomorrow
昨天|zuótiān|yesterday
前天|qiántiān|the day before yesterday
后天|hòutiān|the day after tomorrow
星期|xīngqī|week
周|zhōu|week
周末|zhōumò|weekend
中学生|zhōngxuéshēng|middle school student
点|diǎn|o'clock
分|fēn|minute
刻|kè|quarter (of an hour)
差|chà|to (before the hour); lacking
钟|zhōng|clock
现在|xiànzài|now
早饭|zǎofàn|breakfast
午饭|wǔfàn|lunch
晚饭|wǎnfàn|dinner
做|zuò|to do
作业|zuòyè|homework
功课|gōngkè|schoolwork
去|qù|to go
先|xiān|first
然后|ránhòu|then
再|zài|again; then (after something else)
戏剧|xìjù|drama
游戏|yóuxì|game
听|tīng|to listen
玩|wán|to play
滑板|huábǎn|skateboarding
一起|yìqǐ|together
公园|gōngyuán|park
体育中心|tǐyù zhōngxīn|sports centre`,
`中国菜|zhōng guó cài|Chinese food
西餐|xī cān|Western food
快餐|kuài cān|fast food
比如|bǐ rú|for example
非常|fēi cháng|very / extremely
米饭|mǐ fàn|cooked rice
面条|miàn tiáo|noodles
饺子|jiǎozi|dumpling
炒饭|chǎo fàn|fried rice
炒面|chǎo miàn|fried noodles
炒菜|chǎo cài|stir-fried dishes
包子|bāo zi|steamed stuffed bun
小笼包|xiǎo lóng bāo|small steamed buns with stuffing
火锅|huǒguō|hotpot
粥|zhōu|porridge
油条|yóu tiáo|fried dough sticks
鸡蛋|jī dàn|egg
汉堡包|hàn bǎo bāo|hamburger
薯条|shǔ tiáo|french fries
牛排|niú pái|steak
沙拉|shā lā|salad
炸鸡|zhà jī|fried chicken
三文鱼|sān wén yú|salmon
热狗|rè gǒu|hot dog
意大利面|yì dà lì miàn|pasta
披萨|pīsà|pizza
面包|miàn bāo|bread
三明治|sān míng zhì|sandwich
不喜欢|bù xǐ huān|don't like
还是|háishì|or
更|gèng|even more
吃|chī|to eat
喝|hē|to drink
因为|yīnwèi|because
所以|suǒ yǐ|so, therefore
总是|zǒng shì|always
经常|jīngcháng|often; frequently
常常|chángcháng|often
通常|tōng cháng|usually
不常|bù cháng|not often
有时候|yǒu shí hou|sometimes
偶尔|ǒu ěr|occasionally
从来不|cóng lái bù|never`,
`水|shuǐ|water
可乐|kělè|cola
牛奶|niú nǎi|milk
茶|chá|tea
咖啡|kāfēi|coffee
果汁|guǒ zhī|fruit juice
橙汁|chéng zhī|orange juice
奶茶|nǎi chá|milk tea
冰|bīng|ice
热|rè|hot
汤|tāng|soup
冰淇淋|bīng qí lín|ice cream
蛋糕|dàn gāo|cake
甜点|tián diǎn|dessert
糖|táng|sugar
巧克力|qiǎo kè lì|chocolate
太|tài|too (much)
好吃|hǎo chī|delicious
难吃|nán chī|not tasty
好喝|hǎo hē|tasty (for drinks)
难喝|nán hē|unpleasant to drink
觉得|juéde|to feel; to think (opinion)
点|diǎn|to order (food or drinks)
份|fèn|portion, copy (measure word)
块|kuài|piece, chunk, money (measure word)
杯|bēi|cup, glass (measure word)
碗|wǎn|bowl (measure word)
盘|pán|plate (measure word)`,
`水果|shuǐ guǒ|fruit
苹果|píng guǒ|apple
香蕉|xiāng jiāo|banana
梨|lí|pear
西瓜|xī guā|watermelon
橙子|chéng zi|orange
葡萄|pú tao|grape
芒果|máng guǒ|mango
草莓|cǎo méi|strawberry
桃|táo|peach
蔬菜|shū cài|vegetables
青菜|qīng cài|green leafy vegetables
黄瓜|huáng guā|cucumber
西红柿|xī hóng shì|tomato
土豆|tǔ dòu|potato
海鲜|hǎi xiān|seafood
肉|ròu|meat
味道|wèi dào|taste, flavour
咸|xián|salty
油|yóu|oil; oily
酸|suān|sour
甜|tián|sweet
苦|kǔ|bitter
辣|là|spicy
又…又…|yòu…yòu…|both…and…
很|hěn|very
为什么|wèishénme|why
有点儿|yǒudiǎnr|a little / somewhat
买|mǎi|buy
中|zhōng|middle
西|xī|west
中餐|zhōngcān|Chinese food
炸|zhà|deep-fry
鸡|jī|chicken
鱼|yú|fish
羊|yáng|sheep / lamb
蛋|dàn|egg
从不|cóngbù|never
餐厅|cāntīng|restaurant
了|le|particle for completed action
冷|lěng|cold
炒|chǎo|stir-fry
淡|dàn|bland / light`,
];

// Build [hanzi, pinyin, english, "Prescribed words", lessonIndex]
const PRESCRIBED = (() => {
  const seen = new Set(), out = [];
  PRESCRIBED_RAW.forEach((block, li) => block.split("\n").forEach(line => {
    const [h, p, e] = line.split("|").map(s => s.trim());
    if (!h || seen.has(h)) return;
    seen.add(h);
    out.push([h, p, e, "Prescribed words", UNIT_OF_LESSON[li]]);
  }));
  return out;
})();
