class ProductList extends React.Component {
  state = {
    products: [],
  }
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     products: [],
  //   }
  //   this.handleProductUpVote = this.handleProductUpVote.bind(this);
  // }

  componentDidMount() {
    this.setState({ products: Seed.products })
  }

  handleProductUpVote = (productId) => {
    //1. Dung map de duyet qua va tra ve 1 array moi
    const nextProducts = this.state.products.map((product) => {
      //2. Nếu product matched với productId thì tạo 1 object mới, overwrite property vote của object mới này
      if(product.id === productId) {
        return Object.assign({}, product, {
          votes: product.votes + 1,
        });
      // Nếu không matched thì trả về object chưa sửa
      } else {
        return product;
      }
    })
    //3. Dùng setState để update trạng thái
    this.setState( {
      products: nextProducts,
    })
  }

  render() {
    const products =this.state.products.sort((a, b) => (
      b.votes - a.votes
    ));

    const productComponents = products.map((product) => (
      <div className='ui unstackable items'>
        <Product
          id={product.id}
          title={product.title}
          description={product.description}
          url={product.url}
          votes={product.votes}
          submitterAvatarUrl={product.submitterAvatarUrl}
          productImageUrl={product.productImageUrl}     
          onVote={this.handleProductUpVote}     
        />
      </div>
      ));

      return (
        <div className='ui unstackable items'>
          {productComponents}
        </div>
      );
  }
}

class Product extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // this.handleUpVote = this.handleUpVote.bind(this);
  // }

  handleUpVote = () => (this.props.onVote(this.props.id));

  render() {
    return(
      <div className='item'>
        <div className='image'>
          <img src={this.props.productImageUrl} />
        </div>
        <div className='middle aligned content'>
          <div className='header'>
            <a role="button" onClick={this.handleUpVote}>
              <i className='large caret up icon' />
            </a>
            {this.props.votes}
          </div>
          <div className='description'>
            <a href={this.props.url}>{this.props.title}</a>
            <p>{this.props.description}</p>
          </div>
          <div className='extra'>
            <span>Submitted by:</span>
            <img
              className='ui avatar image'
              src={this.props.submitterAvatarUrl}
            />
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<ProductList/>, document.getElementById('content'));