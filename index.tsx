import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// --- Data Latihan ---

const hijaiyahLetters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
const latinLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

const surahAlFatihah = [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
    'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'مَٰلِكِ يَوْمِ ٱلدِّينِ',
    'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
    'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ'
];

const surahAnNas = [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
    'مَلِكِ ٱلنَّاسِ',
    'إِلَٰهِ ٱلنَّاسِ',
    'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ',
    'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ',
    'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ'
];

const surahAlFalaq = [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
    'مِن شَرِّ مَا خَلَقَ',
    'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
    'وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ',
    'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ'
];

const surahAlIkhlas = [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    'ٱللَّهُ ٱلصَّمَدُ',
    'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ'
];

const islamicPhrases = [
    'سبحان الله',
    'الحمد لله',
    'الله أكبر',
    'لا إله إلا الله',
    'السلام عليكم ورحمة الله وبركاته'
];

const juz28 = [
    // Surah Al-Mujadila (Lengkap)
    "قَدْ سَمِعَ ٱللَّهُ قَوْلَ ٱلَّتِى تُجَٰدِلُكَ فِى زَوْجِهَا وَتَشْتَكِىٓ إِلَى ٱللَّهِ وَٱللَّهُ يَسْمَعُ تَحَاوُرَكُمَآ ۚ إِنَّ ٱللَّهَ سَمِيعٌۢ بَصِيرٌ",
    "ٱلَّذِينَ يُظَٰهِرُونَ مِنكُم مِّن نِّسَآئِهِم مَّا هُنَّ أُمَّهَٰتِهِمْ ۖ إِنْ أُمَّهَٰتِهُمْ إِلَّا ٱلَّٰٓـِٔى وَلَدْنَهُمْ ۚ وَإِنْهُمْ لَيَقُولُونَ مُنكَرًا مِّنَ ٱلْقَوْلِ وَزُورًا ۚ وَإِنَّ ٱللَّهَ لَعَفُوٌّ غَفُورٌ",
    "وَٱلَّذِينَ يُظَٰهِرُونَ مِن نِّسَآئِهِمْ ثُمَّ يَعُودُونَ لِمَا قَالُوا۟ فَتَحْرِيرُ رَقَبَةٍ مِّن قَبْلِ أَن يَتَمَآسَّا ۚ ذَٰلِكُمْ تُوعَظُونَ بِهِۦ ۚ وَٱللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ",
    "فَمَن لَّمْ يَجِدْ فَصِيَامُ شَهْرَيْنِ مُتَتَابِعَيْنِ مِن قَبْلِ أَن يَتَمَآسَّا ۖ فَمَن لَّمْ يَسْتَطِعْ فَإِطْعَامُ سِتِّينَ مِسْكِينًا ۚ ذَٰلِكَ لِتُؤْمِنُوا۟ بِٱللَّهِ وَرَسُولِهِۦ ۚ وَتِلْكَ حُدُودُ ٱللَّهِ ۗ وَلِلْكَٰفِرِينَ عَذَابٌ أَلِيمٌ",
    "إِنَّ ٱلَّذِينَ يُحَآدُّونَ ٱللَّهَ وَرَسُولَهُۥ كُبِتُوا۟ كَمَا كُبِتَ ٱلَّذِينَ مِن قَبْلِهِۦ ۚ وَقَدْ أَنزَلْنَآ ءَايَٰتٍۭ بَيِّنَٰتٍ ۚ وَلِلْكَٰفِرِينَ عَذَابٌ مُّهِينٌ",
    "يَوْمَ يَبْعَثُهُمُ ٱللَّهُ جَمِيعًا فَيُنَبِّئُهُم بِمَا عَمِلُوٓا۟ ۚ أَحْصَىٰهُ ٱللَّهُ وَنَسُوهُ ۚ وَٱللَّهُ عَلَىٰ كُلِّ شَىْءٍ شَهِيدٌ",
    "أَلَمْ تَرَ أَنَّ ٱللَّهَ يَعْلَمُ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۖ مَا يَكُونُ مِن نَّجْوَىٰ ثَلَٰثَةٍ إِلَّا هُوَ رَابِعُهُمْ وَلَا خَمْسَةٍ إِلَّا هُوَ سَادِسُهُمْ وَلَآ أَدْنَىٰ مِن ذَٰلِكَ وَلَآ أَكْثَرَ إِلَّا هُوَ مَعَهُمْ أَيْنَ مَا كَانُوا۟ ۖ ثُمَّ يُنَبِّئُهُم بِمَا عَمِلُوا۟ يَوْمَ ٱلْقِيَٰمَةِ ۚ إِنَّ ٱللَّهَ بِكُلِّ شَىْءٍ عَلِيمٌ",
    "أَلَمْ تَرَ إِلَى ٱلَّذِينَ نُهُوا۟ عَنِ ٱلنَّجْوَىٰ ثُمَّ يَعُودُونَ لِمَا نُهُوا۟ عَنْهُ وَيَتَنَٰجَوْنَ بِٱلْإِثْمِ وَٱلْعُدْوَٰنِ وَمَعْصِيَتِ ٱلرَّسُولِ وَإِذَا جَآءُوكَ حَيَّوْكَ بِمَا لَمْ يُحَيِّكَ بِهِ ٱللَّهُ وَيَقُولُونَ فِىٓ أَنفُسِهِمْ لَوْلَا يُعَذِّبُنَا ٱللَّهُ بِمَا نَقُولُ ۚ حَسْبُهُمْ جَهَنَّمُ يَصْلَوْنَهَا ۖ فَبِئْسَ ٱلْمَصِيرُ",
    "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِذَا تَنَٰجَيْتُمْ فَلَا تَتَنَٰجَوْا۟ بِٱلْإِثْمِ وَٱلْعُدْوَٰنِ وَمَعْصِيَتِ ٱلرَّسُولِ وَتَنَٰجَوْا۟ بِٱلْبِرِّ وَٱلتَّقْوَىٰ ۖ وَٱتَّقُوا۟ ٱللَّهَ ٱلَّذِىٓ إِلَيْهِ تُحْشَرُونَ",
    "إِنَّمَا ٱلنَّجْوَىٰ مِنَ ٱلشَّيْطَٰنِ لِيَحْزُنَ ٱلَّذِينَ ءَامَنُوا۟ وَلَيْسَ بِضَآرِّهِمْ شَيْـًٔا إِلَّا بِإِذْنِ ٱللَّهِ ۚ وَعَلَى ٱللَّهِ فَلْيَتَوَكَّلِ ٱلْمُؤْمِنُونَ",
    "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِذَا قيلَ لَكُمْ تَفَسَّحُوا۟ فِى ٱلْمَجَٰلِسِ فَٱفْسَحُوا۟ يَفْسَحِ ٱللَّهُ لَكُمْ ۖ وَإِذَا قِيلَ ٱنشُزُوا۟ فَٱنشُزُوا۟ يَرْفَعِ ٱللَّهُ ٱلَّذِينَ ءَامَنُوا۟ مِنكُمْ وَٱلَّذِينَ أُوتُوا۟ ٱلْعِلْمَ dَرَجَٰتٍ ۚ وَٱللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ",
    "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِذَا نَٰجَيْتُمُ ٱلرَّسُولَ فَقَدِّمُوا۟ bَيْنَ يَدَىْ نَجْوَىٰكُمْ صَدَقَةً ۚ ذَٰلِكَ خَيْرٌ لَّكُمْ وَأَطْهَرُ ۚ فَإِن لَّمْ تَجِدُوا۟ فَإِنَّ ٱللَّهَ غَفُورٌ رَّحِيمٌ",
    "ءَأَشْفَقْتُمْ أَن تُقَدِّمُوا۟ bَيْنَ يَدَىْ نَجْوَىٰكُمْ صَدَقَٰتٍ ۚ فَإِذْ لَمْ تَفْعَلُوا۟ وَتَابَ ٱللَّهُ عَلَيْكُمْ فَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزكَوٰةَ وَأَطِيعُوا۟ ٱللَّهَ وَرَسُولَهُۥ ۚ وَٱللَّهُ خَبِيرٌۢ بِمَا تَعْمَلُونَ",
    "أَلَمْ تَرَ إِلَى ٱلَّذِينَ تَوَلَّوْا۟ قَوْمًا غَضِبَ ٱللَّهُ عَلَيْهِم مَّا هُم مِّنكُمْ وَلَا مِنْهُمْ وَيَحْلِفُونَ عَلَى ٱلْكَذِبِ وَهُمْ يَعْلَمُونَ",
    "أَعَدَّ ٱللَّهُ لَهُمْ عَذَابًا شَدِيدًا ۖ إِنَّهُمْ سَآءَ مَا كَانُوا۟ يَعْمَلُونَ",
    "ٱتَّخَذُوٓا۟ أَيْمَٰنَهُمْ جُنَّةً فَصَدُّوا۟ عَن سَبِيلِ ٱللَّهِ فَلَهُمْ عَذَابٌ مُّهِينٌ",
    "لَّن تُغْنِىَ عَنْهُمْ أَمْوَٰلُهُمْ وَلَآ أَوْلَٰدُهُم مِّنَ ٱللَّهِ شَيْـًٔا ۚ أُو۟لَٰٓئِكَ أَصْحَٰبُ ٱلنَّارِ ۖ هُمْ فِيهَا خَٰلِدُونَ",
    "يَوْمَ يَبْعَثُهُمُ ٱللَّهُ جَمِيعًا فَيَحْلِفُونَ لَهُۥ كَمَا يَحْلِفُونَ لَكُمْ ۖ وَيَحْسَبُونَ أَنَّهُمْ عَلَىٰ شَىْءٍ ۚ أَلَآ إِنَّهُمْ هُمُ ٱلْكَٰذِبُونَ",
    "ٱسْتَحْوَذَ عَلَيْهِمُ ٱلشَّيْطَٰنُ فَأَنسَىٰهُمْ ذِكْرَ ٱللَّهِ ۚ أُو۟لَٰٓئِكَ حِزْبُ ٱلشَّيْطَٰنِ ۚ أَلَآ إِنَّ حِزْبُ ٱلشَّيْطَٰنِ هُمُ ٱلْخَٰسِرُونَ",
    "إِنَّ ٱلَّذِينَ يُحَآدُّونَ ٱللَّهَ وَرَسُولَهُۥٓ أُو۟لَٰٓئِكَ فِى ٱلْأَذَلِّينَ",
    "كَتَبَ ٱللَّهُ لَأَغْلِبَنَّ أَنَا۠ وَرُسُلِىٓ ۚ إِنَّ ٱللَّهَ قَوِىٌّ عَزِيزٌ",
    "لَّا تَجِدُ قَوْمًا يُؤْمِنُونَ بِٱللَّهِ وَٱلْيَوْمِ ٱلْءَاخِرِ يُوَآدُّونَ مَنْ حَآدَّ ٱللَّهَ وَرَسُولَهُۥ وَلَوْ كَانُوٓا۟ ءَابَآءَهُمْ أَوْ أَبْنَآءَهُمْ أَوْ إِخْوَٰنَهُمْ أَوْ عَشِيرَتَهُمْ ۚ أُو۟لَٰٓئِكَ كَتَبَ فِى قُلُوبِهِمُ ٱلْإِيمَٰنَ وَأَيَّدَهُم بِرُوحٍ مِّنْهُ ۖ وَيُدْخِلُهُمْ جَنَّٰتٍ تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَٰرُ خَٰلِدِينَ فِيهَا ۚ رَضِىَ ٱللَّهُ عَنْهُمْ وَرَضُوا۟ cَنْهُ ۚ أُو۟لَٰٓئِكَ حِزْبُ ٱللَّهِ ۚ أَلَآ إِنَّ حِزْبُ ٱللَّهِ هُمُ ٱلْمُفْلِحُونَ"
];
const juz29 = [
    // Surah Al-Mulk (Lengkap)
    "تَبَارَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
    "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ",
    "ٱلَّذِى خَلَقَ سَبْعَ سَمَٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَٰنِ مِن تَفَٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
    "ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ",
    "وَلَقَدْ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنْيَا بِمَصَٰبِيحَ وَجَعَلْنَٰهَا رُجُومًا لِّلشَّيَٰطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ ٱلسَّعِيرِ",
    "وَلِلَّذِينَ كَفَرُوا۟ بِرَبِّهِمْ عَذَابُ جَهَنَّمَ ۖ وَبِئْسَ ٱلْمَصِيرُ",
    "إِذَآ أُلْقُوا۟ فِيهَا سَمِعُوا۟ لَهَا شَهِيقًا وَهِىَ تَفُورُ",
    "تَكَادُ تَمَيَّزُ مِنَ ٱلْغَيْظِ ۖ كُلَّمَآ أُلْقِىَ فِيهَا فَوْجٌ سَأَلَهُمْ خَزَنَتُهَآ أَلَمْ يَأْتِكُمْ nذِيرٌ",
    "قَالُوا۟ بَلَىٰ قَدْ جَآءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ ٱللَّهُ مِن شَىْءٍ إِنْ أَنتُمْ إِلَّا فِى ضَلَٰلٍ كَبِيرٍ",
    "وَقَالُوا۟ لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا ਕُنَّا فِىٓ أَصْحَٰبِ ٱلسَّعِيرِ",
    "فَٱعْتَرَفُوا۟ بِذَنۢبِهِمْ فَسُحْقًا لِّأَصْحَٰبِ ٱلسَّعِيرِ",
    "إِنَّ ٱلَّذِينَ يَخْشَوْنَ رَبَّهُم بِٱلْغَيْبِ لَهُم مَّغْفِرَةٌ وَأَجْرٌ كَبِيرٌ",
    "وَأَسِرُّوا۟ قَوْلَكُمْ أَوِ ٱجْهَرُوا۟ بِهِۦٓ ۖ إِنَّهُۥ عَلِيمٌۢ بِذَاتِ ٱلصُّدُورِ",
    "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ ٱللَّطِيفُ ٱلْخَبِيرُ",
    "هُوَ ٱلَّذِى جَعَلَ لَكُمُ ٱلْأَرْضَ ذَلُولًا فَٱمْشُوا۟ فِى مَنَاكِبِهَا وَكُلُوا۟ مِن رِّزْقِهِۦ ۖ وَإِلَيْهِ ٱلنُّشُورُ",
    "ءَأَمِنتُم مَّن فِى ٱلسَّمَآءِ أَن يَخْسِفَ بِكُمُ ٱلْأَرْضَ فَإِذَا هِىَ تَمُورُ",
    "أَمْ أَمِنتُم مَّن فِى ٱلسَّمَآءِ أَن يُرْسِلَ عَلَيْكُمْ حَاصِبًا ۖ فَسَتَعْلَمُونَ كَيْفَ نَذِيرِ",
    "وَلَقَدْ كَذَّبَ ٱلَّذِينَ مِن قَبْلِهِمْ فَكَيْفَ كَانَ نَكِيرِ",
    "أَوَلَمْ يَرَوْا۟ إِلَى ٱلطَّيْرِ فَوْقَهُمْ صَٰٓفَّٰتٍ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا ٱلرَّحْمَٰنُ ۚ إِنَّهُۥ بِكُلِّ شَىْءٍۭ bَصِيرٌ",
    "أَمَّنْ هَٰذَا ٱلَّذِى هُوَ جُندٌ لَّكُمْ يَنصُرُكُم مِّن دُونِ ٱلرَّحْمَٰنِ ۚ إِنِ ٱلْكَٰفِرُونَ إِلَّا فِى غُرُورٍ",
    "أَمَّنْ هَٰذَا ٱلَّذِى يَرْزُقكُمْ إِنْ أَمْسَكَ رِزْقَهُۥ ۚ بَل لَّجُّوا۟ فِى عُتُوٍّ وَنُفُورٍ",
    "أَفَمَن يَمْشِى مُكِبًّا عَلَىٰ وَجْهِهِۦٓ أَهْدَىٰٓ أَمَّن يَمْشِى سَوِيًّا عَلَىٰ صِرَٰطٍ mُّسْتَقِيمٍ",
    "قُلْ هُوَ ٱلَّذِىٓ أَنشأَكُمْ وَجَعَلَ لَكُمُ ٱلسَّمْعَ وَٱلْأَبْصَٰرَ وَٱلْأَفْـِٔدَةَ ۖ قَلِيلًا مَّا تَشْكُرُونَ",
    "قُلْ هُوَ ٱلَّذِى ذَرَأَكُمْ فِى ٱلْأَرْضِ وَإِلَيْهِ تُحْشَرُونَ",
    "وَيَقُولُونَ مَتَىٰ هَٰذَا ٱلْوَعْدُ إِن كُنتُمْ صَٰدِقِينَ",
    "قُلْ إِنَّمَا ٱلْعِلْمُ عِندَ ٱللَّهِ وَإِنَّمَآ أَنَا۠ نَذِيرٌ mُّبِينٌ",
    "فَلَمَّا رَأَوْهُ زُلْفَةً سِيٓـَٔتْ وُجُوهُ ٱلَّذِينَ كَفَرُوا۟ وَقِيلَ هَٰذَا ٱلَّذِى كُنتُم بِهِۦ تَدَّعُونَ",
    "قُلْ أَرَءَيْتُمْ إِنْ أَهْلَكَنِىَ ٱللَّهُ وَمَن مَّعِىَ أَوْ رَحِمَنَا فَمَن يُجِيرُ ٱلْكَٰفِرِينَ مِنْ عَذَابٍ أَلِيمٍ",
    "قُلْ هُوَ ٱلرَّحْمَٰنُ ءَامَنَّا بِهِۦ وَعَلَيْهِ تَوَكَّلْنَا ۖ فَسَتَعْلَمُونَ مَنْ هُوَ فِى ضَلَٰلٍ mُّبِينٍ",
    "قُلْ أَرَءَيْتُمْ إِنْ أَصْبَحَ مَآؤُكُمْ غَوْرًا فَمَن يَأْتِيكُم بِمَآءٍ مَّعِينٍۭ"
];
const juz30 = [
    // Surah An-Naba' (Lengkap)
    "عَمَّ يَتَسَآءَلُونَ",
    "عَنِ ٱلنَّبَإِ ٱلْعَظِيمِ",
    "ٱلَّذِى هُمْ فِيهِ مُخْتَلِفُونَ",
    "كَلَّا سَيَعْلَمُونَ",
    "ثُمَّ كَلَّا سَيَعْلَمُونَ",
    "أَلَمْ نَجْعَلِ ٱلْأَرْضَ مِهَٰدًا",
    "وَٱلْجِبَالَ أَوْتَادًا",
    "وَخَلَقْنَٰكُمْ أَزْوَٰجًا",
    "وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا",
    "وَجَعَلْنَا ٱلَّيْلَ لِبَاسًا",
    "وَجَعَلْنَا ٱلنَّهَارَ مَعَاشًا",
    "وَبَنَيْنَا فَوْقَكُمْ سَبْعًا شِدَادًا",
    "وَجَعَلْنَا سِرَاجًا وَهَّاجًا",
    "وَأَنزَلْنَا مِنَ ٱلْمُعْصِرَٰتِ مَآءً ثَجَّاجًا",
    "لِّنُخْرِجَ بِهِۦ حَبًّا وَنَبَاتًا",
    "وَجَنَّٰتٍ أَلْفَافًا",
    "إِنَّ يَوْمَ ٱلْفَصْلِ كَانَ مِيقَٰتًا",
    "يَوْمَ يُنفخُ فِى ٱلصُّورِ فَتَأْتُونَ أَفْوَاجًا",
    "وَفُتِحَتِ ٱلسَّمَآءُ فَكَانَتْ أَبْوَٰبًا",
    "وَسُيِّرَتِ ٱلْجِبَالُ فَكَانَتْ سَرَابًا",
    "إِنَّ جَهَنَّمَ كَانَتْ مِرْصَادًا",
    "لِّلطَٰغِينَ مَـَٔابًا",
    "لَّٰبِثِينَ فِيهَآ أَحْقَابًا",
    "لَّا يَذُوقُونَ فِيهَا بَرْدًا وَلَا شَرَابًا",
    "إِلَّا حَمِيمًا وَغَسَّاقًا",
    "جَزَآءً وِفَاقًا",
    "إِنَّهُمْ كَانُوا۟ لَا يَرْجُونَ حِسَابًا",
    "وَكَذَّبُوا۟ بِـَٔايَٰتِنَا كِذَّابًا",
    "وَكُلَّ شَىْءٍ أَحْصَيْنَٰهُ كِتَٰبًا",
    "فَذُوقُوا۟ فَلَن نَّزِيدَكُمْ إِلَّا عَذَابًا",
    "إِنَّ لِلْمُتَّقِينَ مَفَازًا",
    "حَدَآئِقَ وَأَعْنَٰبًا",
    "وَكَوَاعِبَ أَتْرَابًا",
    "وَكَأْسًا دِهَاقًا",
    "لَّا يَسْمَعُونَ فِيهَا لَغْوًا وَلَا كِذَّٰبًا",
    "جَزَآءً مِّن رَّبِّكَ عَطَآءً حِسَابًا",
    "رَّبِّ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ وَمَا بَيْنَهُمَا ٱلرَّحْمَٰنِ ۖ لَا يَمْلِكُونَ مِنْهُ خِطَابًا",
    "يَوْمَ يَقُومُ ٱلرُّوحُ وَٱلْمَلَٰٓئِكَةُ صَفًّا ۖ لَّا يَتَكَلَّمُونَ إِلَّا مَنْ أَذِنَ لَهُ ٱلرَّحْمَٰنُ وَقَالَ صَوَابًا",
    "ذَٰلِكَ ٱلْيَوْمُ ٱلْحَقُّ ۖ فَمَن شَآءَ ٱتَّخَذَ إِلَىٰ رَبِّهِۦ مَـَٔابًا",
    "إِنَّآ أَنذَرْنَٰكُمْ عَذَابًا قَرِيبًا يَوْمَ يَنظُرُ ٱلْمَرْءُ مَا قَدَّمَتْ يَدَاهُ وَيَقُولُ ٱلْكَافِرُ يَٰلَيْتَنِى كُنتُ تُرَٰبًۢا"
];

const indonesianProverbs = [
    "Bhinneka Tunggal Ika",
    "Sedia payung sebelum hujan",
    "Air beriak tanda tak dalam",
    "Merdeka atau Mati"
];

const englishEnrichment = [
    "Sphinx of black quartz, judge my vow.",
    "To be, or not to be, that is the question.",
    "The only thing we have to fear is fear itself."
];

const arabicProverbs = [
    "من جد وجد",
    "الوقت كالسيف إن لم تقطعه قطعك",
    "إن شاء الله",
    "ما شاء الله"
];

const practiceData = {
    hijaiyah: [
        ...hijaiyahLetters, 
        ...islamicPhrases,
        ...surahAlFatihah, 
        ...surahAnNas,
        ...surahAlFalaq,
        ...surahAlIkhlas,
        ...juz30,
        ...juz29, 
        ...juz28
    ],
    latin: {
        id: [...latinLetters, "Selamat Pagi", "Apa Kabar?", "Terima Kasih", "Indonesia Raya", ...indonesianProverbs],
        en: [...latinLetters, "Hello World", "How are you?", "The quick brown fox jumps over the lazy dog.", "Good Morning", ...englishEnrichment],
        ar: [...latinLetters, "مرحبا بالعالم", "كيف حالك؟", "صباح الخير", ...arabicProverbs]
    },
    cursive: {
        id: [...latinLetters, "Menulis indah", "Belajar bersama", "Satu Nusa Satu Bangsa", ...indonesianProverbs],
        en: [...latinLetters, "Cursive Writing", "Practice makes perfect", "Hello beautiful world", ...englishEnrichment],
        ar: [...latinLetters, "كتابة متصلة", "أهلاً وسهلاً", "السلام عليكم", ...arabicProverbs]
    }
};


const translations = {
    id: {
        title: "كتابة",
        subtitle: "Asah seni kaligrafi dan tulisan tangan Anda.",
        modes: { hijaiyah: "Hijaiyah", latin: "Latin", cursive: "Menulis Indah" },
        controls: { prev: "Sebelumnya", next: "Berikutnya", clear: "Hapus", save: "Simpan", eraser: "Penghapus", pan: "Geser", resetView: "Atur Ulang Tampilan" },
        donation: {
            message: "Bermanfaat? Dukung kami dengan berdonasi melalui:",
            account: "Bank BCA: 2872380826 (a/n La Ode Abu Hanifa)",
            copy: "Salin",
            copied: "Tersalin!",
            close: "Tutup",
            supportTitle: "Dukung Kami"
        },
        theme: {
            toggleTitle: "Ganti Tema"
        }
    },
    en: {
        title: "كتابة",
        subtitle: "Hone your art of calligraphy and handwriting.",
        modes: { hijaiyah: "Hijaiyah", latin: "Latin", cursive: "Cursive" },
        controls: { prev: "Previous", next: "Next", clear: "Clear", save: "Save", eraser: "Eraser", pan: "Pan", resetView: "Reset View" },
        donation: {
            message: "Find this useful? Support us with a donation:",
            account: "BCA Bank: 2872380826 (La Ode Abu Hanifa)",
            copy: "Copy",
            copied: "Copied!",
            close: "Close",
            supportTitle: "Support Us"
        },
        theme: {
            toggleTitle: "Toggle Theme"
        }
    },
    ar: {
        title: "كتابة",
        subtitle: "اتقن فن الخط العربي والكتابة اليدوية.",
        modes: { hijaiyah: "هجاء", latin: "لاتيني", cursive: "كتابة" },
        controls: { prev: "السابق", next: "التالي", clear: "مسح", save: "حفظ", eraser: "ممحاة", pan: "تحريك", resetView: "إعادة ضبط العرض" },
        donation: {
            message: "هل تجد هذا مفيدًا؟ ادعمنا بالتبرع:",
            account: "بنك BCA: 2872380826 (باسم لا أودي أبو حنيفة)",
            copy: "نسخ",
            copied: "تم النسخ!",
            close: "إغلاق",
            supportTitle: "ادعمنا"
        },
        theme: {
            toggleTitle: "تغيير السمة"
        }
    }
};

type WritingMode = 'hijaiyah' | 'latin' | 'cursive';
type Language = 'id' | 'en' | 'ar';
type ActiveTool = 'pen' | 'eraser' | 'pan';
type Theme = 'light' | 'dark';

interface Point { x: number; y: number; }
interface Stroke { points: Point[]; color: string; tool: ActiveTool; }

const AnimatedGuide = ({ language }: { language: Language }) => {
    const text = {
        id: 'Mulai menulis di area ini',
        en: 'Start writing in this area',
        ar: 'ابدأ الكتابة في هذه المنطقة'
    };
    
    const pathLength = 230;
    const drawPath = "M 30,80 Q 50,40 90,60 T 170,80";

    return (
        <div className="animated-guide">
            <svg width="200" height="150" viewBox="0 0 200 150" aria-hidden="true">
                <defs>
                    <path id="motionPath" d={drawPath} fill="none" />
                </defs>
                <circle r="8" fill="var(--primary-accent-color)">
                    <animateMotion dur="5s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.6;1">
                        <mpath href="#motionPath" />
                    </animateMotion>
                    <animate attributeName="r" values="8;8;0" keyTimes="0;0.6;1" dur="5s" repeatCount="indefinite" />
                </circle>
                <path d={drawPath} fill="none" stroke="var(--text-color-primary)" strokeWidth="5" strokeLinecap="round" strokeDasharray={pathLength} strokeDashoffset={pathLength}>
                    <animate 
                        attributeName="stroke-dashoffset" 
                        values={`${pathLength};0;0;${pathLength}`} 
                        keyTimes="0;0.6;0.8;1" 
                        dur="5s" 
                        repeatCount="indefinite" 
                    />
                </path>
                <text x="100" y="130" textAnchor="middle" fill="var(--text-color-secondary)" fontSize="16" fontFamily="var(--font-family-latin), var(--font-family-arabic)">
                    {text[language]}
                </text>
            </svg>
        </div>
    );
};

const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke | null) => {
    if (!stroke || stroke.points.length === 0) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.tool === 'eraser' ? 20 : 5;
    ctx.globalCompositeOperation = stroke.tool === 'pen' ? 'source-over' : 'destination-out';

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    stroke.points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';
};

const DonationBanner = ({ t, onClose, onCopy, copyText }) => {
    return (
        <div className="donation-banner">
            <div className="donation-content">
                <p>{t.message}</p>
                <div className="donation-details">
                    <span>{t.account}</span>
                    <button onClick={onCopy} className="copy-button">
                        <i data-lucide="copy"></i> {copyText}
                    </button>
                </div>
            </div>
            <button onClick={onClose} className="close-banner-button" title={t.close} aria-label={t.close}>
                <i data-lucide="x-circle"></i>
            </button>
        </div>
    );
};

const App = () => {
    const [language, setLanguage] = useState<Language>('id');
    const [writingMode, setWritingMode] = useState<WritingMode>('hijaiyah');
    // Initialize theme state by synchronously reading the attribute set by the inline script.
    const [theme, setTheme] = useState<Theme>(() => {
        const initialTheme = document.documentElement.getAttribute('data-theme');
        return (initialTheme === 'dark' ? 'dark' : 'light');
    });
    const [practiceIndex, setPracticeIndex] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    const [strokeColor, setStrokeColor] = useState('#F2F2F2');
    const [activeTool, setActiveTool] = useState<ActiveTool>('pen');
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [showDonationBanner, setShowDonationBanner] = useState(false);
    const [donationBannerDismissed, setDonationBannerDismissed] = useState(false);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const guideCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const strokeCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const lastPointRef = useRef<Point | null>(null);
    const activePointers = useRef(new Map<number, Point>());
    const lastGesture = useRef<{ distance: number; center: Point } | null>(null);
    const prevStrokesLength = useRef(0);

    const t = translations[language];
    const colors = ['#F2F2F2', '#D4AF37', '#4A90E2', '#8B0000', '#2E7D32', '#607D8B', '#BF360C'];

    const [copyText, setCopyText] = useState(t.donation.copy);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registered with scope: ', registration.scope);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed: ', error);
                    });
            });
        }
    }, []);

    useEffect(() => {
        // This effect now only handles the donation banner logic on mount.
        try {
            const dismissed = localStorage.getItem('donationBannerDismissed') === 'true';
            setDonationBannerDismissed(dismissed);
        } catch (error) {
            console.warn('Could not access localStorage for donation banner:', error);
        }
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        setCopyText(t.donation.copy);
    }, [t]);

    useEffect(() => {
        if (!donationBannerDismissed) {
            const timer = setTimeout(() => {
                setShowDonationBanner(true);
            }, 3000); // Show after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [donationBannerDismissed]);

    const handleCloseBanner = () => {
        setShowDonationBanner(false);
        setDonationBannerDismissed(true);
        try {
            localStorage.setItem('donationBannerDismissed', 'true');
        } catch (error) {
            console.error("Could not save to localStorage", error);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText('2872380826');
        setCopyText(t.donation.copied);
        setTimeout(() => {
            setCopyText(t.donation.copy);
        }, 2000);
    };

    const currentPracticeList = useMemo(() => {
        if (writingMode === 'latin' || writingMode === 'cursive') {
            return practiceData[writingMode][language];
        }
        return practiceData.hijaiyah;
    }, [writingMode, language]);

    const currentText = currentPracticeList[practiceIndex] || '';

    const handleClear = useCallback(() => {
        setStrokes([]);
        setCurrentStroke(null);
    }, []);

    const resetView = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        setPracticeIndex(0);
        handleClear();
        resetView();
    }, [writingMode, language, handleClear, resetView]);

    const drawGuide = useCallback((ctx: CanvasRenderingContext2D) => {
        const canvas = ctx.canvas;
        const guideColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color-primary');
        ctx.fillStyle = `${guideColor}1A`; // Add alpha for transparency
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    
        let font;
        if (writingMode === 'hijaiyah') font = 'Noto Naskh Arabic';
        else if (writingMode === 'cursive') font = 'Dancing Script';
        else font = 'Roboto';
    
        const baseFontSize = Math.min(canvas.height / 5, 120);
        ctx.font = `${baseFontSize}px "${font}"`;
    
        const maxWidth = canvas.width * 0.9;
    
        const getWrappedLines = (context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
            const words = text.split(' ');
            const lines: string[] = [];
            let currentLine = '';
    
            for (const word of words) {
                const testLine = currentLine === '' ? word : `${currentLine} ${word}`;
                const metrics = context.measureText(testLine);
                if (metrics.width > maxWidth && currentLine !== '') {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);
            return lines;
        };
    
        const lines = getWrappedLines(ctx, currentText, maxWidth);
        const lineHeight = baseFontSize * (writingMode === 'hijaiyah' ? 1.6 : 1.4);
        const totalTextBlockHeight = (lines.length - 1) * lineHeight;
        const startY = (canvas.height / 2) - (totalTextBlockHeight / 2);
    
        lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
        });
    }, [currentText, writingMode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const container = canvas.parentElement as HTMLElement;
        let animationFrameId: number;

        const resizeHandler = () => {
            if (!container) return;
            const { width, height } = container.getBoundingClientRect();
            const newWidth = Math.round(width);
            const newHeight = Math.round(height);

            if (canvasSize.width !== newWidth || canvasSize.height !== newHeight) {
                setCanvasSize({ width: newWidth, height: newHeight });
            }
        };
        
        const observer = new ResizeObserver(() => {
            animationFrameId = window.requestAnimationFrame(resizeHandler);
        });

        observer.observe(container);
        resizeHandler();

        return () => {
            observer.disconnect();
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
        };
    }, [canvasSize.width, canvasSize.height]);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) return;

        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        if (!guideCanvasRef.current) guideCanvasRef.current = document.createElement('canvas');
        guideCanvasRef.current.width = canvasSize.width;
        guideCanvasRef.current.height = canvasSize.height;
        const guideCtx = guideCanvasRef.current.getContext('2d');
        if (guideCtx) {
            drawGuide(guideCtx);
        }

        if (!strokeCanvasRef.current) strokeCanvasRef.current = document.createElement('canvas');
        strokeCanvasRef.current.width = canvasSize.width;
        strokeCanvasRef.current.height = canvasSize.height;
        const strokeCtx = strokeCanvasRef.current.getContext('2d');
        if (strokeCtx) {
            strokeCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            strokes.forEach(stroke => drawStroke(strokeCtx, stroke));
        }

    }, [canvasSize, drawGuide, strokes]);

    useEffect(() => {
        const guideCanvas = guideCanvasRef.current;
        const ctx = guideCanvas?.getContext('2d');
        if (!ctx || !guideCanvas) return;
        ctx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
        drawGuide(ctx);
    }, [drawGuide, theme]);

    useEffect(() => {
        const strokeCanvas = strokeCanvasRef.current;
        const ctx = strokeCanvas?.getContext('2d');
        if (!ctx || !strokeCanvas) return;

        if (strokes.length === 0) {
            ctx.clearRect(0, 0, strokeCanvas.width, strokeCanvas.height);
        } else if (strokes.length > prevStrokesLength.current) {
            const lastStroke = strokes[strokes.length - 1];
            drawStroke(ctx, lastStroke);
        } else if (strokes.length < prevStrokesLength.current) {
            ctx.clearRect(0, 0, strokeCanvas.width, strokeCanvas.height);
            strokes.forEach(stroke => drawStroke(ctx, stroke));
        }
        
        prevStrokesLength.current = strokes.length;
    }, [strokes]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color-canvas');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);
        
        if (guideCanvasRef.current) ctx.drawImage(guideCanvasRef.current, 0, 0);
        if (strokeCanvasRef.current) ctx.drawImage(strokeCanvasRef.current, 0, 0);

        drawStroke(ctx, currentStroke);

        ctx.restore();
    }, [zoom, pan, currentStroke, canvasSize, strokes, drawGuide, theme]);

    const getPointInCanvas = (clientX: number, clientY: number): Point | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left - pan.x) / zoom,
            y: (clientY - rect.top - pan.y) / zoom,
        };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (activePointers.current.size > 1) {
            setIsDrawing(false);
            setCurrentStroke(null);
        }

        if (activePointers.current.size === 2) {
            const pointers: Point[] = Array.from(activePointers.current.values());
            const p1 = pointers[0];
            const p2 = pointers[1];
            const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
            lastGesture.current = { distance, center };
            setIsPanning(true); 
        } else if (activePointers.current.size === 1) {
            if (activeTool === 'pan') {
                setIsPanning(true);
                lastPointRef.current = { x: e.clientX, y: e.clientY };
            } else {
                setIsDrawing(true);
                const point = getPointInCanvas(e.clientX, e.clientY);
                if (!point) return;
                setCurrentStroke({ points: [point], color: strokeColor, tool: activeTool });
            }
        }
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!activePointers.current.has(e.pointerId)) return;
        activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (activePointers.current.size === 2) {
            if (!lastGesture.current) return;

            const pointers: Point[] = Array.from(activePointers.current.values());
            const p1 = pointers[0];
            const p2 = pointers[1];
            const newDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            const newCenter = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

            const { distance: prevDist, center: prevCenter } = lastGesture.current;
            const dx = newCenter.x - prevCenter.x;
            const dy = newCenter.y - prevCenter.y;
            const zoomFactor = prevDist > 0 ? newDist / prevDist : 1;
            const newZoom = zoom * zoomFactor;
            const clampedZoom = Math.max(0.2, Math.min(newZoom, 5));
            
            if (clampedZoom !== zoom || dx !== 0 || dy !== 0) {
                 setPan(currentPan => {
                    const canvas = canvasRef.current;
                    if (!canvas) return currentPan;
                    const rect = canvas.getBoundingClientRect();
                    const zoomPointX = newCenter.x - rect.left;
                    const zoomPointY = newCenter.y - rect.top;
        
                    const pannedX = currentPan.x + dx;
                    const pannedY = currentPan.y + dy;
        
                    const finalPanX = zoomPointX - (zoomPointX - pannedX) * (clampedZoom / zoom);
                    const finalPanY = zoomPointY - (zoomPointY - pannedY) * (clampedZoom / zoom);
        
                    return { x: finalPanX, y: finalPanY };
                });
                setZoom(clampedZoom);
            }
            lastGesture.current = { distance: newDist, center: newCenter };
        } else if (activePointers.current.size === 1) {
            if (isPanning && activeTool === 'pan' && lastPointRef.current) {
                const dx = e.clientX - lastPointRef.current.x;
                const dy = e.clientY - lastPointRef.current.y;
                setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                lastPointRef.current = { x: e.clientX, y: e.clientY };
            } else if (isDrawing) {
                const point = getPointInCanvas(e.clientX, e.clientY);
                if (!point) return;
                setCurrentStroke(prev => {
                    if (!prev) return null;
                    const newPoints = [...prev.points, point];
                    return { ...prev, points: newPoints };
                });
            }
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        activePointers.current.delete(e.pointerId);

        if (activePointers.current.size === 0) {
            if (isDrawing && currentStroke && currentStroke.points.length > 1) {
                setStrokes(prev => [...prev, currentStroke]);
            }
            setIsDrawing(false);
            setIsPanning(false);
            setCurrentStroke(null);
            lastPointRef.current = null;
            lastGesture.current = null;
        } else if (activePointers.current.size === 1) {
            lastGesture.current = null;
            const pointers = Array.from(activePointers.current.values());
            lastPointRef.current = pointers[0];
        }
    };

    const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
    
        const zoomFactor = 1.1;
        const newZoom = e.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
        const clampedZoom = Math.max(0.2, Math.min(newZoom, 5));
        
        if (clampedZoom === zoom) return;
    
        const newPanX = mouseX - (mouseX - pan.x) * (clampedZoom / zoom);
        const newPanY = mouseY - (mouseY - pan.y) * (clampedZoom / zoom);
    
        setZoom(clampedZoom);
        setPan({ x: newPanX, y: newPanY });
    };
    
    const handleNavigation = (direction: 'next' | 'prev') => {
        handleClear();
        resetView();
        if (currentPracticeList.length === 0) return;
        setPracticeIndex(prev => {
            if (direction === 'next') {
                return (prev + 1) % currentPracticeList.length;
            } else {
                return (prev - 1 + currentPracticeList.length) % currentPracticeList.length;
            }
        });
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if(!tempCtx) return;
        
        tempCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color-canvas');
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        if(strokeCanvasRef.current) tempCtx.drawImage(strokeCanvasRef.current, 0, 0);

        const link = document.createElement('a');
        link.download = `كتابة_${currentText.substring(0, 10)}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    };
    
    useLayoutEffect(() => {
        // This effect runs synchronously after DOM mutations but before the browser paints.
        // This guarantees that the theme attribute is set before any other effects
        // that might rely on the computed styles, fixing race conditions.
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.error("Could not save theme to localStorage", error);
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [theme, language]);

    const modeClasses = {
        hijaiyah: 'mode-hijaiyah',
        latin: 'mode-latin',
        cursive: 'mode-cursive'
    };

    return (
        <div className="app-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
             <div className="top-bar">
                <header>
                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </header>
                <div className="top-controls">
                    <button onClick={toggleTheme} className="control-button" title={t.theme.toggleTitle} aria-label={t.theme.toggleTitle}>
                        <i data-lucide={theme === 'light' ? 'moon' : 'sun'}></i>
                    </button>
                    {donationBannerDismissed && !showDonationBanner && (
                        <button onClick={() => setShowDonationBanner(true)} className="control-button support-button" title={t.donation.supportTitle} aria-label={t.donation.supportTitle}>
                            <i data-lucide="heart"></i>
                        </button>
                    )}
                    <div className="language-selector">
                    {(['id', 'en', 'ar'] as Language[]).map(lang => (
                        <button key={lang} onClick={() => setLanguage(lang)} className={language === lang ? 'active' : ''}>
                            {lang.toUpperCase()}
                        </button>
                    ))}
                    </div>
                </div>
            </div>

            <main>
                 <div className={`mode-selector ${modeClasses[writingMode]}`}>
                    <span className="active-indicator"></span>
                    {(['hijaiyah', 'latin', 'cursive'] as WritingMode[]).map(mode => (
                        <button key={mode} onClick={() => setWritingMode(mode)} className={writingMode === mode ? 'active' : ''}>
                            {t.modes[mode]}
                        </button>
                    ))}
                </div>

                <div className="canvas-container">
                    {(strokes.length === 0 && !isDrawing) && <AnimatedGuide language={language} />}
                    <canvas
                        ref={canvasRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        onWheel={handleWheel}
                        className={`${
                            activeTool === 'pen' ? 'pen-cursor' :
                            activeTool === 'eraser' ? 'eraser-cursor' :
                            'pan-cursor'
                        }${isPanning ? ' is-panning' : ''}`}
                    />
                </div>

                 <div className="controls-wrapper">
                    <div className="color-palette">
                        {colors.map(color => (
                            <div
                                key={color}
                                className={`color-dot ${strokeColor === color && activeTool === 'pen' ? 'active' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => { setStrokeColor(color); setActiveTool('pen'); }}
                                onPointerDown={(e) => e.stopPropagation()}
                                role="button"
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                    </div>
                    <div className="zoom-controls desktop-only">
                        <input
                            type="range"
                            min="0.2"
                            max="5"
                            step="0.1"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            onPointerDown={(e) => e.stopPropagation()}
                            title="Zoom"
                            aria-label="Zoom slider"
                        />
                         <button onClick={resetView} title={t.controls.resetView} className="action-button" aria-label={t.controls.resetView}>
                            <i data-lucide="expand"></i>
                        </button>
                    </div>
                    <div className="action-buttons">
                         <button className={`action-button pan-button desktop-only ${activeTool === 'pan' ? 'active' : ''}`} onClick={() => setActiveTool('pan')} title={t.controls.pan} aria-label={t.controls.pan}>
                             <i data-lucide="move"></i>
                        </button>
                        <button className={`action-button eraser-button ${activeTool === 'eraser' ? 'active' : ''}`} onClick={() => setActiveTool('eraser')} title={t.controls.eraser} aria-label={t.controls.eraser}>
                             <i data-lucide="eraser"></i>
                        </button>
                        <button className="action-button clear-button" onClick={handleClear} title={t.controls.clear} aria-label={t.controls.clear}>
                             <i data-lucide="trash-2"></i>
                        </button>
                        <button className="action-button save-button" onClick={handleSave} title={t.controls.save} aria-label={t.controls.save}>
                            <i data-lucide="save"></i>
                        </button>
                    </div>
                </div>

                <div className="navigation-controls">
                     <button onClick={() => handleNavigation('prev')}>
                        <i data-lucide={language === 'ar' ? 'arrow-right' : 'arrow-left'}></i>
                        <span>{t.controls.prev}</span>
                    </button>
                    <button onClick={() => handleNavigation('next')}>
                        <span>{t.controls.next}</span>
                         <i data-lucide={language === 'ar' ? 'arrow-left' : 'arrow-right'}></i>
                    </button>
                </div>
            </main>
             {showDonationBanner && <DonationBanner t={t.donation} onClose={handleCloseBanner} onCopy={handleCopy} copyText={copyText} />}
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);

// Define Lucide type for window object
declare global {
    interface Window {
        lucide: {
            createIcons: () => void;
        };
    }
}