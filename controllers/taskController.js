const Task = require('../models/Task');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
exports.createTask = async (req, res) => {
    const { title, description, assignedTo, dueDate, labels } = req.body;

    try {
        const task = new Task({
            title,
            description,
            assignedTo,
            dueDate,
            creator: req.user.id,
            labels: labels ? labels.split(',') : [],
        });

        await task.save();
        console.log('Task created:', task); // Debug log
        res.status(201).json(task);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).send('Server error');
    }
};

// @route   GET /api/tasks
// @desc    Get all tasks assigned to the logged-in user, optionally filtered by labels
// @access  Private
// @route   GET /api/tasks
// @desc    Get all tasks assigned to the logged-in user, optionally filtered by labels
// @access  Private
// exports.getTasks = async (req, res) => {
//     try {
//         let filter = { assignee: req.user.id };

//         // Check if labels are provided in query params
//         if (req.query.labels) {
//             const labelsArray = req.query.labels.split(',');
//             filter.labels = { $in: labelsArray };
//         }

//         console.log('Fetching tasks with filter:', filter);

//         const tasks = await Task.find(filter);
//         console.log('Fetched tasks:', tasks); // Log tasks here

//         res.json(tasks);
//     } catch (err) {
//         console.error('Error fetching tasks:', err);
//         res.status(500).send('Server error');
//     }
// };

exports.getTasks = async (req, res) => {
    try {
        let filter = {};

        // Check if labels are provided in query params
        if (req.query.labels) {
            const labelsArray = req.query.labels.split(',');
            filter = { ...filter, labels: { $in: labelsArray } };
        }

        const tasks = await Task.find(filter);
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// @route   GET /api/tasks/:id
// @desc    Get a single task by ID
// @access  Private
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        console.log('Fetched task by ID:', task); // Debug log
        res.json(task);
    } catch (err) {
        console.error('Error fetching task by ID:', err);
        res.status(500).send('Server error');
    }
};

// @route   PUT /api/tasks/:id
// @desc    Update a task by ID
// @access  Private
exports.updateTask = async (req, res) => {
    const { title, description, assignee, dueDate, status, labels } = req.body;

    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (task.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Update task fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.assignee = assignee || task.assignee;
        task.dueDate = dueDate || task.dueDate;
        task.status = status || task.status;
        task.labels = labels ? labels.split(',') : task.labels;
        task.updatedAt = Date.now();

        await task.save();
        console.log('Updated task:', task); // Debug log
        res.json(task);
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send('Server error');
    }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete a task by ID
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (task.creator && task.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);
        console.log('Deleted task:', task); // Debug log
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send('Server error');
    }
};
