"use client"

import { Board, Column, JobApplication } from "@/lib/models/models.types"
import { Award, Calendar, CheckCircle2, Mic, MoreVertical, Trash2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";
import { useBoard } from "@/lib/hooks/useBoards";


interface KanbanBoardProps {
    board: Board;
    userId: string;
};

interface ColConfig {
    color: string; icon: React.ReactNode
}

const COLUMN_CONFIG: Array<ColConfig> = [
    {
    color: "bg-cyan-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-green-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-4 w-4" />,
  },
];

function DroppableColumn({column, config, boardId, sortedColumns, onMove}: {column: Column; config:ColConfig; boardId: string; sortedColumns: Column[]; onMove: (jobId: string, newColumnId: string) => Promise<void> }) {
    console.log("DroppableColumn received column:", column);
    console.log("Column jobApplications:", column.jobApplications);
    
    const sortedJobs = column.jobApplications?.sort((a,b) => a.order-b.order) || [];
    console.log("Sorted jobs:", sortedJobs);
    
    return (
        <Card className="min-w-[300px] flex-shrink-0 shadow-md p-0">
            <CardHeader className={`${config.color} text-white rounded-t-lg p-3`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        <CardTitle className="text-white text-base font-semibold"
                        >{column.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-white hover:bg-white/20"
                                >
                                <MoreVertical className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4"/>
                                Delete Column
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>\

            <CardContent className={`space-y-2 pt-4 bg-gray-50/50 min-h-[400px] rounded-b-lg `}>
                {sortedJobs.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <p>No job applications yet</p>
                        <p className="text-sm">Click the button below to add one</p>
                    </div>
                ) : (
                    sortedJobs.map((job, index)=> (
                        <SortableJobCard 
                            key={index} 
                            job={{...job, columnId: job.columnId || column._id}}
                            columns={sortedColumns}
                            onMove={onMove}
                        />
                    ))
                )}

                <CreateJobApplicationDialog columnId={column._id} boardId={boardId}/>
            </CardContent>
        </Card>
    )

}

function SortableJobCard({job, columns, onMove}: {job: JobApplication; columns: Column[]; onMove: (jobId: string, newColumnId: string) => Promise<void>}) {
    console.log("Rendering SortableJobCard:", job);
    
    return (
        <div className="mb-2">
            <JobApplicationCard job={job} columns={columns} onMove={onMove}/>
        </div>
    )
}

export default function KanbanBoard({board, userId}: KanbanBoardProps) {
    if (!board || !board.columns) {
        console.log("No board or columns found");
        return <div>No board data available</div>;
    }

    // const columns = board.columns;
    
    const {columns, moveJob} =useBoard(board);

    const sortedColumns = columns?.sort((a,b) => a.order-b.order) || [];

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max px-4">
                {columns.map((col, index) => {
                    const config = COLUMN_CONFIG[index] || {
                        color: "bg-gray-500",
                        icon: <Calendar className="h-4 w-4"/>
                    };
                    return (
                        <DroppableColumn
                            key={index}
                            column={col}
                            config={config}
                            boardId={board._id}
                            sortedColumns={sortedColumns}
                            onMove={moveJob}
                        />
                    )
                })}
            </div>
        </div>
    )
}