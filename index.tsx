import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
    "قَدْ سَمِعَ ٱللَّهُ قَوْلَ ٱلَّتِى تُجَٰدِلُكَ فِى زَوْجِهَا وَتَشْتَكِىٓ إِلَى ٱللَّهِ وَٱللَّهُ يَسْمَعُ تَحَاوُرَكُمَآ ۚ إِنَّ ٱللَّهَ سَمِيعٌۢ بَصِيرٌ", "ٱلَّذِينَ يُظَٰهِرُونَ مِنكُم مِّن نِّسَآئِهِم مَّا هُنَّ أُمَّهَٰتِهِمْ ۖ إِنْ أُمَّهَٰتُهُمْ إِلَّا ٱلَّٰٓـِٔى وَلَدْنَهُمْ ۚ وَإِنَّهُمْ لَيَقُولُونَ مُنكَرًا مِّنَ ٱلْقَوْلِ وَزُورًا ۚ وَإِنَّ ٱللَّهَ لَعَفُوٌ غَفُورٌ", "وَٱلَّذِينَ يُظَٰهِرُونَ مِن نِّسَآئِهِمْ ثُمَّ يَعُودُونَ لِمَا قَالُوا۟ فَتَحْرِيرُ رَقَبَةٍ مِّن قَبْلِ أَن يَتَمَآسَّا ۚ ذَٰلِكُمْ تُوعَظُونَ بِهِۦ ۚ وَٱللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ", "فَمَن لَّمْ يَجِدْ فَصِيَAMُ شَهْرَيْنِ مُتَتَابِعَيْنِ مِن قَبْلِ أَن يَتَمَآسَّا ۖ فَمَن لَّمْ يَسْتَطِcْ فَإِطْعَامُ سِتِّينَ مِسْكِينًا ۚ ذَٰلِكَ لِتُؤْمِنُوا۟ بِٱللَّهِ وَرَسُولِهِۦ ۚ وَتِلْكَ حُدُودُ ٱللَّهِ ۗ وَلِلْكَٰفِرِينَ عَذَابٌ أَلِيمٌ", "إِنَّ ٱلَّذِينَ يُحَآدُّونَ ٱللَّهَ وَرَسُولَهُۥ كُبِتُوا۟ كَمَا كُبِتَ ٱلَّذِينَ مِن قَبْلِهِِمْ ۚ وَقَدْ أَنZَلْنَآ ءَايَٰتٍۭ بَيِّنَٰتٍ ۚ وَلِلْكَٰفِرِينَ عَذَابٌ مُّهِينٌ",
];
const juz29 = [
    // Surah Al-Mulk (Lengkap)
    "تَبَارَكَ ٱلَّذِي بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", "ٱلَّذِي خَلَقَ ٱلْمَوْتَ وَٱلْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ", "ٱلَّذِي خَلَقَ سَبْعَ سَمَٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَٰنِ مِن تَفَٰوُtٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
];
const juz30 = [
    // Surah An-Naba' (Contoh)
    "عَمَّ يَتَسَآءَلُونَ", "عَنِ ٱلنَّبَإِ ٱلْعَظِيمِ", "ٱلَّذِي هُمْ فِيهِ مُخْتَليفُونَ",
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
    },
    en: {
        title: "كتابة",
        subtitle: "Hone your art of calligraphy and handwriting.",
        modes: { hijaiyah: "Hijaiyah", latin: "Latin", cursive: "Cursive" },
        controls: { prev: "Previous", next: "Next", clear: "Clear", save: "Save", eraser: "Eraser", pan: "Pan", resetView: "Reset View" },
    },
    ar: {
        title: "كتابة",
        subtitle: "اتقن فن الخط العربي والكتابة اليدوية.",
        modes: { hijaiyah: "هجاء", latin: "لاتيني", cursive: "كتابة" },
        controls: { prev: "السابق", next: "التالي", clear: "مسح", save: "حفظ", eraser: "ممحاة", pan: "تحريك", resetView: "إعادة ضبط العرض" },
    }
};

type WritingMode = 'hijaiyah' | 'latin' | 'cursive';
type Language = 'id' | 'en' | 'ar';
type ActiveTool = 'pen' | 'eraser' | 'pan';

interface Point { x: number; y: number; }
interface Stroke { points: Point[]; color: string; tool: ActiveTool; }

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

    // Reset composite operation for subsequent draws on the same context
    ctx.globalCompositeOperation = 'source-over';
};

const App = () => {
    const [language, setLanguage] = useState<Language>('id');
    const [writingMode, setWritingMode] = useState<WritingMode>('hijaiyah');
    const [practiceIndex, setPracticeIndex] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    const [strokeColor, setStrokeColor] = useState('#e4e4e7');
    const [activeTool, setActiveTool] = useState<ActiveTool>('pen');
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const guideCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const strokeCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const lastPointRef = useRef<Point | null>(null);
    const activePointers = useRef(new Map<number, Point>());
    const lastGesture = useRef<{ distance: number; center: Point } | null>(null);
    const prevStrokesLength = useRef(0);

    const t = translations[language];
    const colors = ['#e4e4e7', '#f87171', '#fb923c', '#fbbf24', '#4ade80', '#60a5fa', '#c084fc'];

    const currentPracticeList = useMemo(() => {
        if (writingMode === 'latin' || writingMode === 'cursive') {
            return practiceData[writingMode][language];
        }
        return practiceData.hijaiyah;
    }, [writingMode, language]);

    const currentText = currentPracticeList[practiceIndex];

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
        ctx.fillStyle = 'rgba(228, 228, 231, 0.1)'; // Zinc 200 with alpha
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

    // Effect 1: Handle canvas resizing
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
    
    // Effect 2: Initialize and update offscreen canvases when size changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) return;

        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        // Guide Canvas
        if (!guideCanvasRef.current) guideCanvasRef.current = document.createElement('canvas');
        guideCanvasRef.current.width = canvasSize.width;
        guideCanvasRef.current.height = canvasSize.height;
        const guideCtx = guideCanvasRef.current.getContext('2d');
        if (guideCtx) {
            drawGuide(guideCtx);
        }

        // Stroke Canvas
        if (!strokeCanvasRef.current) strokeCanvasRef.current = document.createElement('canvas');
        strokeCanvasRef.current.width = canvasSize.width;
        strokeCanvasRef.current.height = canvasSize.height;
        const strokeCtx = strokeCanvasRef.current.getContext('2d');
        if (strokeCtx) {
            strokeCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            strokes.forEach(stroke => drawStroke(strokeCtx, stroke));
        }

    }, [canvasSize, drawGuide, strokes]);

    // Effect 3: Update guide canvas only when text changes
    useEffect(() => {
        const guideCanvas = guideCanvasRef.current;
        const ctx = guideCanvas?.getContext('2d');
        if (!ctx || !guideCanvas) return;
        ctx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
        drawGuide(ctx);
    }, [drawGuide]);

    // Effect 4: Update stroke canvas (cache) when strokes array changes
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

    // Effect 5: Main composite rendering to visible canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);
        
        if (guideCanvasRef.current) ctx.drawImage(guideCanvasRef.current, 0, 0);
        if (strokeCanvasRef.current) ctx.drawImage(strokeCanvasRef.current, 0, 0);

        drawStroke(ctx, currentStroke);

        ctx.restore();
    }, [zoom, pan, currentStroke, canvasSize, strokes, drawGuide]);

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
        
        tempCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        if(guideCanvasRef.current) tempCtx.drawImage(guideCanvasRef.current, 0, 0);
        if(strokeCanvasRef.current) tempCtx.drawImage(strokeCanvasRef.current, 0, 0);

        const link = document.createElement('a');
        link.download = `كتابة_${currentText.substring(0, 10)}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    };
    
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    return (
        <div className="app-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
             <div className="language-selector">
                {(['id', 'en', 'ar'] as Language[]).map(lang => (
                    <button key={lang} onClick={() => setLanguage(lang)} className={language === lang ? 'active' : ''}>
                        {lang.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="top-panel">
                <header>
                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </header>
                <div className="mode-selector">
                    {(['hijaiyah', 'latin', 'cursive'] as WritingMode[]).map(mode => (
                        <button key={mode} onClick={() => setWritingMode(mode)} className={writingMode === mode ? 'active' : ''}>
                            {t.modes[mode]}
                        </button>
                    ))}
                </div>
            </div>

            <main>
                <div className="canvas-container">
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
                        />
                         <button onClick={resetView} title={t.controls.resetView} className="action-button">
                            <i data-lucide="expand"></i>
                        </button>
                    </div>
                    <div className="action-buttons">
                         <button className={`action-button pan-button desktop-only ${activeTool === 'pan' ? 'active' : ''}`} onClick={() => setActiveTool('pan')} title={t.controls.pan}>
                             <i data-lucide="move"></i>
                        </button>
                        <button className={`action-button eraser-button ${activeTool === 'eraser' ? 'active' : ''}`} onClick={() => setActiveTool('eraser')} title={t.controls.eraser}>
                             <i data-lucide="eraser"></i>
                        </button>
                        <button className="action-button clear-button" onClick={handleClear} title={t.controls.clear}>
                             <i data-lucide="trash-2"></i>
                        </button>
                        <button className="action-button save-button" onClick={handleSave} title={t.controls.save}>
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
