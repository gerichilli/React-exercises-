class TimerDashboard extends React.Component {
    state = {
        timers: []
    }

    componentDidMount() {
        this.loadTimersFromServer();
        setInterval(this.loadTimersFromServer, 5000);
    }

    loadTimersFromServer() {
        client.getTimers(serverTimers => {
            this.setState({ timers: serverTimers })
        })
    }

    handleCreateFormSubmit = (timer) => {
        this.createTimer(timer);
    }

    handleEditFormSubmit = (attrs) => {
        this.updateTimer(attrs);
    }

    handleDeleteTimer = (timerId) => {
        this.deleteTimer(timerId)
    }

    handleStartClick = (timerId) => {
        this.startTimer(timerId);
    }

    handleStopClick = (timerId) => {
        this.stopTimer(timerId);
    }

    createTimer = (timer) => {
        const newTimer = helpers.newTimer(timer);
        this.setState({ timers: this.state.timers.concat(newTimer) })

        client.createTimer(newTimer);
    }

    updateTimer = (attrs) => {
        this.setState({
            timers: this.state.timers.map(timer => {
                if(timer.id === attrs.id) {
                    return Object.assign({}, timer, {
                        title: attrs.title,
                        project: attrs.project
                    })
                } else {
                    return timer
                }
            })
        })

        client.updateTimer(attrs);
    }

    deleteTimer = (timerId) => {    
        this.setState({
            timers: this.state.timers.filter(t => (t.id !== timerId))
        })

        client.deleteTimer(timerId);
    }

    startTimer = (timerId) => {
        const now = Date.now();

        this.setState({
            timers: this.state.timers.map((timer) => {
                if(timer.id === timerId) {
                    return Object.assign({}, timer, {
                        runningSince: now,
                    })
                } else {
                    return timer;
                }
            })
        })

        client.startTimer({id: timerId, start: now});
    }

    stopTimer = (timerId) => {
        const now = Date.now();

        this.setState({
            timers: this.state.timers.map((timer) => {
                if(timer.id === timerId) {
                    const lastElapsed = now - timer.runningSince;
                    return Object.assign({}, timer, {
                        elapsed: timer.elapsed + lastElapsed,
                        runningSince: null,
                    })
                } else {
                    return timer;
                }
            })
        })

        client.stopTimer({id: timerId, stop: now})
    }

    render() {
        if(this.state.timers[0]) {
            return (
                <div className="dashboard">
                    <EditableTimerList 
                        timers={this.state.timers}
                        onFormSubmit={this.handleEditFormSubmit}
                        onTrashClick={this.handleDeleteTimer}
                        onStartClick={this.handleStartClick}
                        onStopClick={this.handleStopClick}
                    />
                    <ToggleableTimerForm 
                        onFormSubmit={this.handleCreateFormSubmit}
                    />
                </div>
            )
        } else {
            return (
                <div className="spinner">
                    <img src="./images/spinner.svg" alt="Loading"/>
                </div>
            )
        } 
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
                onFormSubmit={this.props.onFormSubmit}
                onTrashClick={this.props.onTrashClick}
                onStartClick={this.props.onStartClick}
                onStopClick={this.props.onStopClick}
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

    handleFormClose = () => {
        this.closeForm();
    }

    handleEditClick = () => {
        this.openForm();
    }

    handleSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.closeForm();
    }

    openForm = () => {
        this.setState({ editFormOpen: true })
    }

    closeForm = () => {
        this.setState({ editFormOpen: false })
    }

    render() {
        if (this.state.editFormOpen) {
            return (
                <TimerForm 
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    onFormClose={this.handleFormClose}
                    onFormSubmit={this.handleSubmit}
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
                    onEditClick={this.handleEditClick}
                    onTrashClick={this.props.onTrashClick}
                    onStartClick={this.props.onStartClick}
                    onStopClick={this.props.onStopClick}
                />
            )
        }

    }
}

class Timer extends React.Component {
    componentDidMount() {
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50)
    }

    componentWillMount() {
        clearInterval(this.forceUpdateInterval)
    }

    handleTrashClick = () => {
        this.props.onTrashClick(this.props.id)
    }

    handleStartClick = () => {
        this.props.onStartClick(this.props.id)
    }

    handleStopClick = () => {
        this.props.onStopClick(this.props.id)
    }

    render() {
        const elapsedString = helpers.renderElapsedString(
            this.props.elapsed, this.props.runningSince
        );

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
                        <span className='icon' onClick={this.handleTrashClick}>
                            <i className="bi bi-trash"></i>
                        </span>
                        <span className='icon' onClick={this.props.onEditClick}>
                            <i className="bi bi-pencil-square"></i>
                        </span>
                    </div>
                </div>
                <TimerActionButton 
                    timerIsRunning={!!this.props.runningSince}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick}
                />
            </div>
        )
    }
}

class TimerActionButton extends React.Component {
    render() {
        if(this.props.timerIsRunning) {
            return(
                <div className='timer-button'>
                    <div className='btn btn-stop' onClick={this.props.onStopClick}>
                        Stop
                    </div>
                </div>
            ) 
        } else {
            return(
                <div className='timer-button' onClick={this.props.onStartClick}>
                    <div className='btn btn-start'>
                        Start
                    </div>
                </div>
            )
        }
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
            title: this.state.title,
            project: this.state.project
        })
    }

    render() {
        const submitText = this.props.id ? 'Update' : 'Create';

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

    handleFormClose = () => {
        this.setState({ isOpen: false });
    }

    handleFormSubmit = (timer) => {
        this.props.onFormSubmit(timer)
        this.setState({ isOpen: false })
    }

    render() {
        if (this.state.isOpen) {
            return (
                <TimerForm 
                    onFormClose={this.handleFormClose}
                    onFormSubmit={this.handleFormSubmit}
                />
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