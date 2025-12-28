pack_dir=serve_pack
mkdir -p $pack_dir
rm -rf $pack_dir/all.tar.gz
target_field=@lm_fe
node_modules_field=node_modules/$target_field
mkdir -p $pack_dir/$target_field
compress_packages()
{
    for pack_name in $(ls packages)
    do
        echo handle $pack_name
        dist=packages/$pack_name/dist
        if [ -d $dist ]; then
            cd packages
            tar -czvf ../$pack_dir/$pack_name.tar.gz $pack_name/dist/ $pack_name/package.json
            cd -
        fi
    done
}

compress_all()
{
    cp node_modules/@lm_fe/static packages/ -r
    cd packages
    tar -czvf ../$pack_dir/all.tar.gz ./
    rm -rf static
}

compress_all_tow_step()
{


    # if [ ! -d $pack_dir/$target_field/static ]; then
    #     cp ../static/packages/static/ $pack_dir/$target_field/ -r
    # fi

    for pack_name in $(ls $node_modules_field)
    do

        target_package=$pack_dir/$target_field/$pack_name

        mkdir -p $target_package
        rm $target_package/* -rf

        dist=$node_modules_field/$pack_name/dist
        conf=$node_modules_field/$pack_name/package.json
        asserts=$node_modules_field/$pack_name/asserts

        if [ -d $dist ]; then

            cp -rfu $dist $target_package
            cp $conf $target_package

            if [ $pack_name = "static" ]; then
                cp -rfu $asserts $target_package
            fi

        fi
    done
    cd $pack_dir/$target_field
    tar -czf ../all.tar.gz ./*
    echo success


}

compress_all_tow_step



