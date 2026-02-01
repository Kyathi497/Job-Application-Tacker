"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";
import { error } from "console";





interface JobApplicationData {
    company: string;
    position: string;
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    columnId: string;
    boardId: string;
    tags?: string[];
    description?: string;
}

export async function createJobApplication(data:JobApplicationData) {
    const session = await getSession();
    if (!session?.user) {
        return {error: "Unauthorized"}
    }

    await connectDB();
    const {
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        columnId,
        boardId,
        tags,
        description
    } = data;

    if (!company || !position || !columnId || !boardId) {
        return {error: "Missing required fields"}
    }

    console.log("Creating job application with data:", {
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        columnId,
        boardId,
        tags,
        description,
        userId: session.user.id
    });

    //verify board ownership
    const board = await Board.findOne({
        _id: boardId,
        userId: session.user.id,
    });
    if (!board) {
        return {error: "Board not found"};
    }

    //verify column belongs to board
    const column = await Column.findOne({
        _id: columnId,
        boardId: boardId,
    });
    if (!column) {
        return {error: "column not found"};
    }

    const maxOrder = (await JobApplication.findOne({columnId}).sort({order: -1}).select("order").lean()) as {order: number } | null

    const jobApplication = await JobApplication.create({
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        userId: session.user.id,
        columnId,
        boardId,
        tags: tags || [],
        description,
        status: "applied",
        order: maxOrder ? maxOrder.order + 1 : 0,
    });

    console.log("Created job application:", jobApplication);

    const updateResult = await Column.findByIdAndUpdate(columnId, {
        $push: {jobApplications: jobApplication._id}
    });

    console.log("Updated column:", updateResult);

    // Revalidate the dashboard page to show the new job application
    revalidatePath("/dashboard");

    return {data: JSON.parse(JSON.stringify(jobApplication))};
};

export async function deleteJobApplication(id:string) {
    
    try {
        await connectDB();
        await JobApplication.deleteOne({
            _id: id
        });
    } catch (error) {
        console.log("error while deleting application..")
    }

    revalidatePath('/dashboard')

};

export async function updateJobApplication(id:string, 
    updates: {
    company?: string;
    position?: string;
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    columnId?: string;
    order?: number;
    tags?: string[];
    description?: string;
  }
) {

    const seesion = await getSession();
    if (!seesion?.user) {
        return {error: "Unauthorized"}
    }

    const jobApplication = await JobApplication.findById(id);

    if (!jobApplication) {
        return {error: "Job application not found.."}
    }
    if (jobApplication.userId.toString() !== seesion.user.id) {
    return { error: "Unauthorized" }
    }

    const {columnId, order, ...otherUpdates} = updates;

    const updatesToApply: Partial<{
        company: string;
        position: string;
        location: string;
        notes: string;
        salary: string;
        jobUrl: string;
        columnId: string;
        order: number;
        tags: string[];
        description: string;
    }>= otherUpdates;

    const currentColumnId = jobApplication.columnId.toString();
    const newColumnId = columnId?.toString();

    const isMovingToDifferentColumn = newColumnId && newColumnId !== currentColumnId;

    if (isMovingToDifferentColumn) {
        await Column.findByIdAndUpdate(currentColumnId, {
            $pull: {jobApplications: id },
        });
        const jobInTargetColumn = await JobApplication.find({
            columnId: newColumnId,
            _id: {$ne: id},
        }).sort({order: 1}).lean();

        let newOrderValue: number;
       
    } else {
        
    }
}