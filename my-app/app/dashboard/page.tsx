import KanbanBoard  from "@/components/kanban-borad";
import { getSession } from "@/lib/auth/auth"
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";



export default async function Dashboard() {
    const session = await getSession();
    await connectDB();

    const board = await Board.findOne({
        userId: session?.user.id,
        name: "Job Hunt",
    }).populate({
        path: "columns",
        populate: {
            path: "jobApplications",
        },
    });

    console.log("Fetched board from database:", board);

    if (!board) {
        console.log("No board found for user:", session?.user.id);
        return (
            <div className="min-h-screen bg-white">
                <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold text-black">No Board Found</h1>
                    <p className="text-gray-600">Please create a board first.</p>
                </div>
            </div>
        );
    }

    // Convert MongoDB document to plain object for Client Component
    const boardData = JSON.parse(JSON.stringify(board));

    return(
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black">{boardData?.name}</h1>
                    <p className="text-gray-600">Track your job applications</p>
                </div>
                <KanbanBoard board={boardData} userId={session?.user.id || ""}/>
            </div>
        </div>
    )
} 