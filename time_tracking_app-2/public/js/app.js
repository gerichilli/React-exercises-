class TimerDashboard extends React.Component {
    state = {
        timers: [
            {
                title: "Mow the lawn",
                project: "House Chores",
                id: uuid.v4(),
                elapsed: 5456099,   
                runningSince: Date.now()
            },
            {
                title: "Clear paper jam",
                project: "Office Chores",
                id: uuid.v4(),
                elapsed: 1273998,   
                runningSince: Date.now()
            },
            {
                title: "Ponder origins of universe",
                project: "Life Chores",
                id: uuid.v4(),
                elapsed: 11750,   
                runningSince: Date.now()
            }
        ]
    }

    render() {
        return (
            <div className="dashboard">
                <EditableTimerList 
                    timers={this.state.timers}
                />
                <ToggleableTimerForm />
            </div>
        )
    }
}

class EditableTimerList extends React.Component {
    render() {
        const timerList = this.props.timers.map((timer) => (
            <EditableTimer
                key={timer.id}
                id={timer.id}
                title={timer.title}
                project={timer.project}
                elapsed={timer.elapsed}
                runningSince={timer.runningSince}
            />
        ))

        return (
            <div className="timerlist">
                {timerList}
            </div>
        )
    }
}

class EditableTimer extends React.Component {
    state = {
        editFormOpen: false,
    };

    render() {
        if (this.state.editFormOpen) {
            return (
                <TimerForm 
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                />
            )
        } else {
            return (
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                />
            )
        }

    }
}

class Timer extends React.Component {
    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed);

        return (
            <div className='timer-card'>
                <div className='timer-content'>
                    <div className='timer-title'>
                        {this.props.title}
                    </div>
                    <div className='timer-project'>
                        {this.props.project}
                    </div>
                    <div className='timer-count'>
                        {elapsedString}
                    </div>
                    <div className='action-container'>
                        <span className='icon'>
                            <i className="bi bi-trash"></i>
                        </span>
                        <span className='icon'>
                            <i className="bi bi-pencil-square"></i>
                        </span>
                    </div>
                </div>
                <div className='timer-button'>
                    <div className='btn btn-start'>
                        Start
                    </div>
                </div>
            </div>
        )
    }
}

class TimerForm extends React.Component {
    state = {
        title: this.props.title || '',
        project: this.props.project || ''
    }

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
    }

    handleProjectChange = (e) => {
        this.setState({ project: e.target.value });
    }

    handleSubmit = () => {
        this.props.onFormSubmit({
            id: this.props.id,
            title: this.props.title,
            project: this.props.project
        })
    }

    render() {
        const submitText = this.props.title ? 'Update' : 'Create';

        return (
            <div className='timer-card'>
                <div className='timer-content'>
                    <div className='form'>
                        <div className='field'>
                            <label>Title</label>
                            <input 
                                type='text' 
                                value={this.state.title} 
                                onChange={this.handleTitleChange}
                            />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input 
                                type='text' 
                                value={this.state.project} 
                                onChange={this.handleProjectChange}
                            />
                        </div>
                        <div className='timer-button'>
                            <button 
                                className='btn btn-update' 
                                onClick={this.handleSubmit}
                            >
                                {submitText}
                            </button>
                            <button 
                                className='btn btn-cancel'
                                onClick={this.props.onFormClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class ToggleableTimerForm extends React.Component {
    state = {
        isOpen: false,
    }

    handleFormOpen = () => {
        this.setState({ isOpen: true });
    }

    render() {
        if (this.state.isOpen) {
            return (
                <TimerForm />
            );
        } else {
            return (
                <div className="timer-button-center">
                    <button 
                        className='btn-plus' 
                        onClick={this.handleFormOpen}
                    >
                        <i className="bi bi-plus-lg"></i>
                    </button>
                </div>
            );
        }
    }
}


ReactDOM.render(<TimerDashboard />, document.getElementById('content'));