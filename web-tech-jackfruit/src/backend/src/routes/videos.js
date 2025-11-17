import { Router } from "express";
import Video from "../models/Video.js";
import Teacher from "../models/Teacher.js";

const router = Router();

router.get("/", async (_req, res) => {
    const count = await Video.countDocuments();
    // Ensure we have at least 10 meditation videos
    if (count < 10) {
        // Ensure a diverse set of teachers
        const teacherSeeds = [
            { name: "Asha", bio: "Mindfulness coach", location: "Bengaluru", rating: 4.7, feesPerClass: 350 },
            { name: "Rohan", bio: "Breathwork guide", location: "Pune", rating: 4.6, feesPerClass: 300 },
            { name: "Meera", bio: "Yoga & Nidra", location: "Delhi", rating: 4.8, feesPerClass: 400 },
            { name: "Kabir", bio: "Zen meditation", location: "Mumbai", rating: 4.5, feesPerClass: 320 },
            { name: "Nisha", bio: "Sleep meditation", location: "Chennai", rating: 4.7, feesPerClass: 330 },
            { name: "Arjun", bio: "Focus & Flow", location: "Hyderabad", rating: 4.4, feesPerClass: 310 }
        ];
        const teachers = [];
        for (const t of teacherSeeds) {
            let doc = await Teacher.findOne({ name: t.name });
            if (!doc) doc = await Teacher.create(t);
            teachers.push(doc);
        }

        // Distinct public MP4 sample URLs
        const pool = [
            { title: "Morning Calm", url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4", description: "10 min breathing" },
            { title: "Evening Relax", url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4", description: "Wind down" },
            { title: "Deep Focus", url: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4", description: "Focus and flow" },
            { title: "Sleep Drift", url: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4", description: "Sleep meditation" },
            { title: "Body Scan", url: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4", description: "Awareness scan" },
            { title: "Calm Waves", url: "https://samplelib.com/lib/preview/mp4/sample-1mb.mp4", description: "Soothing ocean" },
            { title: "Soft Rain", url: "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4", description: "Rain ambience" },
            { title: "Gentle Sunrise", url: "https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_2mb.mp4", description: "Start the day" },
            { title: "Mindful Break", url: "https://file-examples.com/storage/fe5d0d3f2d0d0a3c59f5d9b/2017/04/file_example_MP4_480_1_5MG.mp4", description: "Quick reset" },
            { title: "Evening Unwind", url: "https://file-examples.com/storage/fe5d0d3f2d0d0a3c59f5d9b/2017/04/file_example_MP4_640_3MG.mp4", description: "Unwind gently" }
        ];

        const missing = 10 - count;
        if (missing > 0) {
            const toInsert = pool.slice(0, missing).map((v, i) => ({
                ...v,
                teacher: teachers[(i + Math.floor(Math.random() * teachers.length)) % teachers.length]._id,
                avgRating: Math.round((4 + Math.random() * 1) * 10) / 10
            }));
            if (toInsert.length) await Video.insertMany(toInsert);
        }
    }
    const videos = await Video.find().populate("teacher", "name rating");
    return res.json(videos);
});

export default router;


