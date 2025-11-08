# TaskFlow - Complete User Guide

## 🎯 Overview
TaskFlow is a modern project management application that visualizes tasks as an interactive network diagram. It helps you understand task dependencies and project flow at a glance.

## 🚀 Getting Started

### First Launch
1. Open the application in your browser (http://localhost:3001)
2. You'll see a welcome screen with a "Quick Start Guide" button
3. Click it to learn the basics, or start creating tasks immediately

### Creating Your First Task
1. Click **"Add New Task"** in the sidebar
2. Fill in the required information:
   - **Task Name**: A clear, descriptive name (Required)
   - **Description**: Additional details about the task (Optional)
   - **Start Date**: When work on this task begins (Required)
   - **End Date**: Target completion date (Required)
   - **Status**: Current state - Not Started, In Progress, or Completed
   - **Dependencies**: Select tasks that must be completed before this one

3. Click **"Create Task"**

## 📊 Understanding the Network Diagram

### Visual Elements

**Task Nodes**
- Each task appears as a card on the canvas
- Color-coded by status:
  - 🟢 Green border = Completed
  - 🔵 Blue border = In Progress
  - ⚪ Gray border = Not Started
- Shows task name, dates, and current status

**Connections (Edges)**
- Blue arrows show dependencies
- Arrow points FROM prerequisite task TO dependent task
- Animated lines indicate active connections

**Layout**
- Tasks are automatically arranged from left to right
- Tasks with no dependencies appear on the left
- Dependent tasks appear to the right of their prerequisites
- Vertical spacing separates parallel tasks

### Interacting with the Diagram

**Navigation**
- **Zoom**: Scroll wheel or pinch gesture
- **Pan**: Click and drag on empty canvas
- **Fit to View**: Click the fit button in controls
- **Zoom In/Out**: Use control buttons on left side

**Task Operations**
- **View Details**: Click any task card
- **Edit Task**: Click "Edit" button on task or in sidebar
- **Delete Task**: Click "Delete" button (confirms before deleting)
- **Move Task**: Drag task to reposition manually

## 🎨 Sidebar Features

### Statistics Dashboard
- **Total Tasks**: Count of all tasks in project
- **Completed**: Number of finished tasks
- **In Progress**: Currently active tasks
- **Not Started**: Upcoming tasks

### Task List
- Shows all tasks in order
- Click any task to edit
- Color-coded status indicators
- Quick date reference

### Actions
- **Add New Task**: Opens creation form
- **Clear All Tasks**: Removes all tasks (with confirmation)

## 💾 Data Management

### Automatic Saving
- All changes save automatically to browser's localStorage
- No manual save required
- Data persists across browser sessions

### Export Project
1. Click **"Export"** button in header
2. Downloads JSON file with all task data
3. Filename includes current date
4. Save file to your computer

### Import Project
1. Click **"Import"** button in header
2. Select a previously exported JSON file
3. All tasks load into the application
4. Replaces current project data

### Sample Project
- Located in `public/sample-project.json`
- Contains 8 example tasks showing a software development project
- Import to see TaskFlow in action

## 🔧 Advanced Features

### Task Dependencies

**Creating Dependencies**
1. When creating/editing a task, check boxes for prerequisite tasks
2. System prevents circular dependencies
3. Layout automatically updates

**Dependency Rules**
- A task can depend on multiple other tasks
- A task cannot depend on itself
- Dependent tasks appear to the right of prerequisites

### Keyboard Shortcuts
- **Escape**: Close open dialogs
- **Delete**: Remove selected task (when focused)

### Fullscreen Mode
- Click the fullscreen icon in header
- Maximizes diagram for presentations
- Press Escape to exit

## 📱 Responsive Design
- Works on desktop browsers (recommended)
- Tablet support with touch gestures
- Minimum recommended screen: 1024x768

## 🎓 Best Practices

### Organizing Large Projects
1. **Break down work**: Create small, manageable tasks
2. **Clear naming**: Use descriptive task names
3. **Set realistic dates**: Include buffer time
4. **Update status**: Keep task states current
5. **Review dependencies**: Ensure logical flow

### Task Naming Conventions
- Use action verbs: "Design", "Implement", "Test"
- Be specific: "Design User Login Page" vs "Design"
- Keep it concise: Aim for 3-7 words

### Managing Dependencies
- Start with high-level phases
- Add detailed tasks within each phase
- Link phases in sequence
- Identify parallel work streams

## 🐛 Troubleshooting

### Tasks Not Appearing
- Check if sidebar is open (toggle with menu icon)
- Ensure tasks have valid dates
- Try fit-to-view button to locate tasks

### Data Lost
- Check if same browser and profile
- localStorage is browser-specific
- Use Export feature for backups

### Layout Issues
- Close and reopen sidebar to recalculate
- Refresh browser to reset view
- Clear cache if problems persist

### Performance
- Keep projects under 100 tasks for optimal performance
- Split very large projects into multiple files
- Use Export/Import to archive completed projects

## 💡 Tips & Tricks

1. **Start Simple**: Begin with major milestones, add details later
2. **Color Code**: Use status colors to quickly see progress
3. **Regular Updates**: Update task status as work progresses
4. **Export Often**: Back up your project regularly
5. **Dependencies First**: Define relationships before detailed scheduling
6. **Review Weekly**: Check and update task status regularly

## 🔐 Privacy & Security
- All data stored locally in your browser
- No data sent to external servers
- No account or login required
- Export feature allows you to control your data

## 📞 Support

### Common Issues
- **Q**: Can I share my project with others?
  **A**: Export as JSON and share the file. Others can import it.

- **Q**: Does it work offline?
  **A**: Yes, once loaded, works completely offline.

- **Q**: Can I print the diagram?
  **A**: Use browser print (Ctrl+P) or take screenshot.

- **Q**: Maximum number of tasks?
  **A**: No hard limit, but 50-100 tasks recommended for performance.

### Getting Help
- Check the Quick Start Guide (? icon in header)
- Review README.md in project folder
- Examine sample project for examples

## 🎉 You're Ready!
Start building your project network diagram and managing your tasks efficiently with TaskFlow!
